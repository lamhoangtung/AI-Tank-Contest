#include "EvaluatorGetPowerUp.h"
#include "MyTeam.h"
#include "HelperFunctions.h"
#include "Globals.h"

EvaluatorGetPowerUp::~EvaluatorGetPowerUp()
{
}

float EvaluatorGetPowerUp::CalculateDesirability(MyTank* pTank)
{
	glm::vec2 closestPowerup = MyTeamMgr->GetCurrentPowerUpPos();
	float safeDistanceToGet = 4;
	float distance = Manhattan(closestPowerup, pTank->GetPosition());
	if (MyTeamMgr->GetClosetTankToPowerUpId() == pTank->ID()
		&& distance <= safeDistanceToGet)
	{
//		PrintVector("Tank to powerup: ", pTank->GetPosition());
		return 101;
	}
	return 1;
}

void EvaluatorGetPowerUp::SetGoal(MyTank* pTank)
{
	pTank->GetBrain()->AddGoalGetPowerUp();
}
