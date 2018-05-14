#include "GoalHuntEnemy.h"
#include "GoalType.h"
#include "GoalMoveToPosition.h"
#include "GoalShootEnemy.h"
#include "GoalReload.h"
#include "Globals.h"
#include "HelperFunctions.h"
#include "GoalGoToPosToAttackEnemy.h"
#include "GoalCover.h"
#include "MyTeam.h"
glm::vec2 testTargetPos = glm::vec2(2, 14.5);
GoalHuntEnemy::~GoalHuntEnemy()
{
}

GoalHuntEnemy::GoalHuntEnemy(MyTank* pOwner):GoalComposite(pOwner, goal_hunt_enemy)
{
}

void GoalHuntEnemy::Activate()
{
//	std::cout << "Inside goal huntn enemy.\n";
	m_iStatus = active;
	//chose best enemy target.
	m_vCurrentAimPosition = m_pOwner->GetCurrentTargetEnemyPos();
//	m_vCurrentAimPosition = testTargetPos;
	//chose best position to go.
//	m_vCurrentGoodPosition = TargetMgr->GetBestPositionForSniperToAttack(m_pOwner, m_vCurrentAimPosition);
//	PrintVector("Mytank position: ", m_pOwner->GetPosition());
//	PrintVector("Target position: ", m_vCurrentAimPosition);
//	PrintVector("Position to attack: ", m_vCurrentGoodPosition);
	//add subgoal to positon.
	RemoveAllSubgoals();
	//not shoot when too far or cooldown of enemy is zero (assume enemy will attack soo :D.)
	if (m_pOwner->isShootableAEnemy(m_vCurrentAimPosition))
	{
		if (m_pOwner->isCurrentEnemyTargetPresent())
		{	
			Tank* targetEnemy = AI::GetInstance()->GetEnemyTank(m_pOwner->GetCurrentTargetEnemyId());
			if (!isGoodTooShootThisEnemy(m_pOwner, targetEnemy))
			{
//				std::cout << "Inside not good to shoot.\n";
				std::vector<glm::vec2> target;
				target.push_back(glm::vec2(targetEnemy->GetX(), targetEnemy->GetY()));
//				target.push_back(testTargetPos);
				AddSubgoal(new GoalCover(m_pOwner, target));
			}else
			{
				AddSubgoal(new GoalShootEnemy(m_pOwner, m_vCurrentAimPosition));
			}
		}
	}
	else
	{
		AddSubgoal(new GoalGoToPosToAttackEnemy(m_pOwner, m_vCurrentAimPosition));
	}	
}

int GoalHuntEnemy::Process()
{
	//if see enemy then attack.
	ActivateIfInactive();
	m_iStatus = ProcessSubgoals();
	if (m_pOwner->GetApiTank()->GetType() == TANK_HEAVY &&
		!MyTeamMgr->isMyTankInsideMySide(m_pOwner->GetPosition()))
	{
		m_pOwner->FireOn();
	}
	ReactivateIfFailed();
	return m_iStatus;
}

void GoalHuntEnemy::Terminate()
{
	m_pOwner->FireOff();
}

bool GoalHuntEnemy::isGoodTooShootThisEnemy(MyTank* myTank, Tank* targetEnemy)
{
	glm::vec2 myTankPos = myTank->GetPosition();
	glm::vec2 fakeBulletPos = glm::vec2(targetEnemy->GetX(), targetEnemy->GetY());
//	glm::vec2 fakeBulletPos = testTargetPos;
	if (TargetMgr->isShootableAEnemy(fakeBulletPos, myTankPos))
	{
		float myTankSpeed = myTank->GetSpeed();
		glm::vec2 fakeBulletDir = TargetMgr->GetDirInViewPointToPoint(myTankPos, fakeBulletPos);
		float bulletSpeed = GetBulletSpeedByTankType(targetEnemy->GetType());

//		bool isNotGoodToShoot = myTank->isClosestEnemyTooCloseToSniper(myTank, targetEnemy)
//			&& (targetEnemy->GetCoolDown() <= 0)
//			&& (myTank->SimulateActionsToChooseGoodActions(myTank, targetEnemy).size() == 0)
//			&& TargetMgr->isTheFakeClosestBulletPossibleToDodgeSideBySide(myTankPos, myTankPos, myTankSpeed,
//															fakeBulletPos, fakeBulletDir, bulletSpeed)
//			;
		bool isNotGoodToShoot = myTank->isClosestEnemyTooCloseToSniper(myTank, targetEnemy)
			&& (targetEnemy->GetCoolDown() <= 0)
			&& TargetMgr->isTheFakeClosestBulletPossibleToDodgeSideBySide(myTankPos, myTankPos, myTankSpeed,
				fakeBulletPos, fakeBulletDir, bulletSpeed)
			;

		return !isNotGoodToShoot;
	}
	return true;
}
