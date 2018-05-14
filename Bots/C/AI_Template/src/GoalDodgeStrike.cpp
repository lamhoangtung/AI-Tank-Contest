#include "GoalDodgeStrike.h"
#include "GoalType.h"
#include "MyTeam.h"
#include "GoalCover.h"
#include "HelperFunctions.h"
#include "Globals.h"
#include "GoalMoveToPosition.h"

GoalDodgeStrike::GoalDodgeStrike(MyTank* pOwner):
	GoalComposite<MyTank>(pOwner, goal_dodge_strike)
{
}

GoalDodgeStrike::~GoalDodgeStrike()
{
}

void GoalDodgeStrike::Activate()
{
	m_iStatus = active;
	RemoveAllSubgoals();
	std::vector<glm::vec2> dangrousPos = 
		MyTeamMgr->GetDangerouseStrikePosToTank(m_pOwner->GetPosition());
//	std::cout << "RUN RUN RUN.\n";
//	PrintVector("Tank pos: ", m_pOwner->GetPosition());
//	PrintVector("Danger strike pos: ", dangrousPos[0]);
	if (!dangrousPos.empty())
	{
		glm::vec2 bestPosToRun = CalculateBestPosToRunAway(dangrousPos[0]);
//		PrintVector("Best pos to go: ", bestPosToRun);
//		AddSubgoal(new GoalMoveToPosition(m_pOwner, bestPosToRun));
		m_pOwner->MoveOn();
		m_pOwner->GetSteering()->SeekOn();
		m_pOwner->GetSteering()->SetTarget(bestPosToRun);
	}
}

int GoalDodgeStrike::Process()
{
	ActivateIfInactive();
	m_iStatus = ProcessSubgoals();
	m_pOwner->StopInTheNextStepIsDangerous();
	ReactivateIfFailed();
	return m_iStatus;
}

void GoalDodgeStrike::Terminate()
{
	m_pOwner->MoveOff();
	m_pOwner->GetSteering()->SeekOff();
}

glm::vec2 GoalDodgeStrike::CalculateBestPosToRunAway(glm::vec2 strikePos)
{
	glm::vec2 bestPos;
	float farestDistance = 0;
	for (glm::vec2 dir : dirs)
	{
		glm::vec2 futurePos = m_pOwner->GetPosition() + m_pOwner->GetSpeed() * dir;
		float distance = Manhattan(futurePos, strikePos);
		if (distance > farestDistance && TargetMgr->isValidTankPosition(futurePos) 
			&& !TargetMgr->isTheSamePositionWithOtherTank(m_pOwner->GetPosition(), futurePos))
		{
			farestDistance = distance;
			bestPos = futurePos;
		}
	}
	return bestPos;
}
