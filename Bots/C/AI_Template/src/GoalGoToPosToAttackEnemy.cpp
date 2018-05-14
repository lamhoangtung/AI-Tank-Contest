#include "GoalGoToPosToAttackEnemy.h"
#include "GoalType.h"
#include "GoalMoveToPosition.h"

GoalGoToPosToAttackEnemy::GoalGoToPosToAttackEnemy(MyTank* pOwner, glm::vec2 target)
	:GoalComposite<MyTank>(pOwner, goal_go_to_pos_to_attack_enemy)
{
	m_vTargetPosition = target;
}

void GoalGoToPosToAttackEnemy::Activate()
{
	m_iStatus = active;
	RemoveAllSubgoals();
	glm::vec2 goodPosToAttack = TargetMgr->GetBestPositionForSniperToAttack(m_pOwner, m_vTargetPosition);
	if (goodPosToAttack != glm::vec2())
	{
		AddSubgoal(new GoalMoveToPosition(m_pOwner, goodPosToAttack));
	}
}

int GoalGoToPosToAttackEnemy::Process()
{
	ActivateIfInactive();
	m_iStatus = ProcessSubgoals();

	m_pOwner->StopInTheNextStepIsDangerous();
	ReactivateIfFailed();
	return m_iStatus;
}

void GoalGoToPosToAttackEnemy::Terminate()
{
}
