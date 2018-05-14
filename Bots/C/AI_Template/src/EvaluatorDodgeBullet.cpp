#include "EvaluatorDodgeBullet.h"
#include "Globals.h"
#include "HelperFunctions.h"

EvaluatorDodgeBullet::~EvaluatorDodgeBullet()
{
}


float EvaluatorDodgeBullet::CalculateDesirability(MyTank* pTank)
{
//	std::cout << "inside dodge evaluator dodgebullet.\n";
	Bullet* closestBullet = TargetMgr->GetClosestDangerBullet(pTank->GetPosition());
//	std::cout << "after get closetdanger bullet.\n";
	if (closestBullet)
	{
		if (TargetMgr->isTheClosestBulletDangerous(pTank, closestBullet))
		{
//			std::cout << "after evaluate dodge bullet.\n";
			return 1000;
		}	
	}
//	std::cout << "after evaluate dodge bullet.\n";
	return 0;
}

void EvaluatorDodgeBullet::SetGoal(MyTank* pTank)
{
	pTank->GetBrain()->AddGoalDodgeBullet();
}
