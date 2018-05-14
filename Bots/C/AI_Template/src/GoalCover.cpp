#include "GoalCover.h"
#include "GoalType.h"
#include "GoalMoveToPosition.h"


GoalCover::GoalCover(MyTank* pOwner, std::vector<glm::vec2> targets)
	:GoalComposite<MyTank>(pOwner, goal_cover)
{
	m_vTargetsToCoverFrom = targets;
}

GoalCover::~GoalCover()
{
}

void GoalCover::Activate()
{
	m_iStatus = active;
	RemoveAllSubgoals();
	glm::vec2 tankPos = m_pOwner->GetPosition();
	float tankSpeed = m_pOwner->GetSpeed();
	glm::vec2 posToCover = TargetMgr->GetPositionToCoverFromTargets(tankPos, tankSpeed, m_vTargetsToCoverFrom);
	if (posToCover != glm::vec2())
	{
		AddSubgoal(new GoalMoveToPosition(m_pOwner, posToCover));
	}
}

int GoalCover::Process()
{
	ActivateIfInactive();
	m_iStatus = ProcessSubgoals();
	m_pOwner->StopInTheNextStepIsDangerous();
	ReactivateIfFailed();
	return m_iStatus;
}

void GoalCover::Terminate()
{

}
