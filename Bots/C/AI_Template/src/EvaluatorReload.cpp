#include "EvaluatorReload.h"

EvaluatorReload::~EvaluatorReload()
{
}

float EvaluatorReload::CalculateDesirability(MyTank* pTank)
{
	if (pTank->GetCoolDown() >= 0 && (pTank->GetApiTank()->GetType() != TANK_HEAVY))
		return 100;
	return 0;
}

void EvaluatorReload::SetGoal(MyTank* pTank)
{
	pTank->GetBrain()->AddGoalReload();
}
