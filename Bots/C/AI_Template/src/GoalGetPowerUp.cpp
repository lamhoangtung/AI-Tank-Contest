#include "GoalGetPowerUp.h"
#include "GoalType.h"
#include "GoalMoveToPosition.h"
#include "MyTeam.h"
#include "HelperFunctions.h"

GoalGetPowerUp::GoalGetPowerUp(MyTank* pOwner):
	GoalComposite<MyTank>(pOwner, goal_get_powerup)
{
}

GoalGetPowerUp::~GoalGetPowerUp()
{
}

void GoalGetPowerUp::Activate()
{
	m_iStatus = active;
	RemoveAllSubgoals();
	glm::vec2 powerUpPos = MyTeamMgr->GetCurrentPowerUpPos();
	if (powerUpPos != glm::vec2())
	{
		AddSubgoal(new GoalMoveToPosition(m_pOwner, powerUpPos));
	}
}

int GoalGetPowerUp::Process()
{
	ActivateIfInactive();
	m_iStatus = ProcessSubgoals();
	ReactivateIfFailed();
	return m_iStatus;
}

void GoalGetPowerUp::Terminate()
{
}
