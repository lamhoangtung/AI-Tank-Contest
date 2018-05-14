#include "EvaluatorHuntEnemy.h"
#include "Globals.h"

EvaluatorHuntEnemy::~EvaluatorHuntEnemy()
{
}

float EvaluatorHuntEnemy::CalculateDesirability(MyTank* pTank)
{
	if (pTank->GetCoolDown() <= 0 && pTank->isCurrentEnemyTargetPresent())
	{
		if (TargetMgr->isShootableAEnemy(pTank->GetPosition(), pTank->GetCurrentTargetEnemyPos()))
			return 201;
		return 100;
	}
	return goalHuntEnemy;
}

void EvaluatorHuntEnemy::SetGoal(MyTank* pTank)
{
	pTank->GetBrain()->AddGoalHuntEnemy();
}
