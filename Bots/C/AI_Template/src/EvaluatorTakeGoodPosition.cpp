#include "EvaluatorTakeGoodPosition.h"
#include "MyTeam.h"

EvaluatorTakeGoodPosition::~EvaluatorTakeGoodPosition()
{
}

float EvaluatorTakeGoodPosition::CalculateDesirability(MyTank* pTank)
{
	if (MyTeamMgr->GetCurrentState() == PREPARE_ATTACKING)
	{
		return 200;
	}
	return 1;
}

void EvaluatorTakeGoodPosition::SetGoal(MyTank* pTank)
{
	pTank->GetBrain()->AddGoalTakeGoodPosition();
}
