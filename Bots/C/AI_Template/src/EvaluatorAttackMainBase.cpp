#include "EvaluatorAttackMainBase.h"
#include "Globals.h"
#include "ai/AI.h"

EvaluatorAttackMainBase::~EvaluatorAttackMainBase()
{
}

float EvaluatorAttackMainBase::CalculateDesirability(MyTank* pTank)
{
//	if (AI::GetInstance()->GetMyTeam() == TEAM_2)
//		return 9999;
	return goalAttackMainBase;
}

void EvaluatorAttackMainBase::SetGoal(MyTank* pTank)
{
	pTank->GetBrain()->AddGoalAttackMainBase();
}
