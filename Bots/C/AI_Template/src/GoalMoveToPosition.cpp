#include "GoalMoveToPosition.h"
#include "GoalType.h"
#include "GoalFollowPath.h"
#include <iostream>
#include "HelperFunctions.h"

GoalMoveToPosition::GoalMoveToPosition(MyTank* pOwner, glm::vec2 d):
	GoalComposite(pOwner, goal_move_to_position),
	m_vDestination(d)
{
}

void GoalMoveToPosition::Activate()
{
	m_iStatus = active;
	RemoveAllSubgoals();
	if(m_pOwner->GetPathPlanner()->RequestPathToPosition(m_vDestination))
	{
		AddSubgoal(new GoalFollowPath(m_pOwner, m_pOwner->GetPathPlanner()->GetPathAsEdges(m_vDestination)));
	}else
	{
//		std::cout << "Cant find a path.\n";
//		m_iStatus = failed;
	}
}

int GoalMoveToPosition::Process()
{
	ActivateIfInactive();
	m_iStatus = ProcessSubgoals();
	ReactivateIfFailed();

	return m_iStatus;
}

void GoalMoveToPosition::Terminate()
{
//	m_pOwner->MoveOn();
}
