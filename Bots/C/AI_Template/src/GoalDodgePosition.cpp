#include "GoalDodgePosition.h"
#include "GoalType.h"
#include "GoalCover.h"
#include "GoalShootEnemy.h"

GoalDodgePosition::GoalDodgePosition(MyTank* pOwner):
	GoalComposite<MyTank>(pOwner, goal_dodge_position)
{
}

GoalDodgePosition::~GoalDodgePosition()
{
}

void GoalDodgePosition::Activate()
{
	m_iStatus = active;
	RemoveAllSubgoals();

	int coolDownToShoot = 2;

	Tank* closestEnemyTank = TargetMgr->GetClosestEnemyTank(m_pOwner->GetPosition());
	if (closestEnemyTank)
	{
		glm::vec2 tankPos = m_pOwner->GetPosition();
		glm::vec2 enemyPos = glm::vec2(closestEnemyTank->GetX(), closestEnemyTank->GetY());
		if (TargetMgr->isShootableAEnemy(enemyPos, tankPos))
		{
			int timeToHit = m_pOwner->GetTimeToHitDodgePosition();
			int bestTimeToDodge = m_pOwner->GetBestTImeToDodgePosition();
			int tankCoolDown = m_pOwner->GetCoolDown();
			int enemyCoolDown = closestEnemyTank->GetCoolDown();

			std::vector<glm::vec2> targetToCover;
			targetToCover.push_back(enemyPos);

//			if (m_pOwner->GetPosition() == glm::vec2(4,7))
//			{
//				std::cout << "Best time to dodge pos: " << bestTimeToDodge << std::endl;
//				std::cout << "Time to hit dodge pos: " << timeToHit << std::endl;
//			}
			if (bestTimeToDodge > timeToHit)/*When cant dodge*/
			{
				if (tankCoolDown > 0)
				{
					AddSubgoal(new GoalCover(m_pOwner, targetToCover));
				}else
				{
					AddSubgoal(new GoalShootEnemy(m_pOwner, enemyPos));
				}
			}else if (bestTimeToDodge == timeToHit)/*Can dodge if immediately dodge*/
			{
				if (tankCoolDown == 0 && enemyCoolDown >= coolDownToShoot)
				{
					AddSubgoal(new GoalShootEnemy(m_pOwner, enemyPos));
				}else
				{
					AddSubgoal(new GoalCover(m_pOwner, targetToCover));
				}
			}
			
		}else
		{
			//stop if cooldown == 0.
		}
	}
}

int GoalDodgePosition::Process()
{
	ActivateIfInactive();
	m_iStatus = ProcessSubgoals();
	ReactivateIfFailed();
	return m_iStatus;
}

void GoalDodgePosition::Terminate()
{
}
