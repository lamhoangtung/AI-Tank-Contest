#include "GoalTakeGoodPosition.h"
#include "GoalType.h"
#include "MyTeam.h"
#include "GoalMoveToPosition.h"
#include "HelperFunctions.h"

GoalTakeGoodPosition::GoalTakeGoodPosition(MyTank* pOwner):
	GoalComposite<MyTank>(pOwner, goal_take_good_position)
{
}

GoalTakeGoodPosition::~GoalTakeGoodPosition()
{
}

void GoalTakeGoodPosition::Activate()
{
	m_iStatus = active;
	RemoveAllSubgoals();
	glm::vec2 goodPos = MyTeamMgr->GetBestPreparingPosition(m_pOwner->GetPosition());
//	PrintVector("Good preparing pos: ", goodPos);
//	PrintVector("Tank pos:", m_pOwner->GetPosition());
	if (goodPos != glm::vec2())
	{
		AddSubgoal(new GoalMoveToPosition(m_pOwner, goodPos));
	}
}

int GoalTakeGoodPosition::Process()
{
	ActivateIfInactive();
	m_iStatus = ProcessSubgoals();
	m_pOwner->StopInTheNextStepIsDangerous();
	ReactivateIfFailed();
	return m_iStatus;
}

void GoalTakeGoodPosition::Terminate()
{
}
