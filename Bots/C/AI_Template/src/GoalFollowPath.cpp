#include "GoalFollowPath.h"
#include "GoalType.h"
#include "GoalTraverseEdge.h"

GoalFollowPath::GoalFollowPath(MyTank* pOwner, std::list<PathEdge> p):
						GoalComposite(pOwner, goal_follow_path),
						m_Path(p)
{
}

void GoalFollowPath::Activate()
{
	m_iStatus = active;
	
	PathEdge edge = m_Path.front();
	m_Path.pop_front();
	AddSubgoal(new GoalTraverseEdge(m_pOwner, edge, m_Path.empty()));
}

int GoalFollowPath::Process()
{
	ActivateIfInactive();

	m_iStatus = m_SubGoals.front()->Process();

	if (m_iStatus == completed && !m_Path.empty())
	{
		m_SubGoals.pop_front();
		Activate();
		m_iStatus = m_SubGoals.front()->Process();
	}

	return m_iStatus;
}

void GoalFollowPath::Terminate()
{

}
