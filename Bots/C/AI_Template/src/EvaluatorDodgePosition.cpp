#include "EvaluatorDodgePosition.h"
#include "HelperFunctions.h"
#include "Globals.h"

glm::vec2 debugEnemyTankPos = glm::vec2(5, 7);
int debugEnemyType = TANK_LIGHT;


EvaluatorDodgePosition::~EvaluatorDodgePosition()
{
}

float EvaluatorDodgePosition::CalculateDesirability(MyTank* pTank)
{
	float bias = 0;
	Tank* closestEnemyTank = TargetMgr->GetClosestEnemyTank(pTank->GetPosition());
	if (closestEnemyTank)
	{
		glm::vec2 tankPos = pTank->GetPosition();
		int tankCoolDown = pTank->GetCoolDown();

		glm::vec2 fakeBulletPos =
			glm::vec2(closestEnemyTank->GetX(), closestEnemyTank->GetY());
		int enemyCoolDown = closestEnemyTank->GetCoolDown();
//		glm::vec2 fakeBulletPos = debugEnemyTankPos;
//		int enemyCooldown = 4;

		if (TargetMgr->isShootableAEnemy(fakeBulletPos, tankPos))
		{
			float tankSpeed = pTank->GetSpeed();
			
			int enemyType = closestEnemyTank->GetType();
//			int enemyType = debugEnemyType;
			glm::vec2 fakeBulletDir = TargetMgr->GetDirInViewPointToPoint(tankPos, fakeBulletPos);
			float bulletSpeed = GetBulletSpeedByTankType(enemyType);

			int timeToHit = TargetMgr->GetTimeAInViewBulletToHitATank(tankPos,
				fakeBulletPos, fakeBulletDir, bulletSpeed);
			glm::vec2 bestDirToDodge;
			int bestTimeToDodge = CANT_DODGE_VALUE;
			TargetMgr->CalculateBestTimeAndDirToDodgeBullet(tankPos, tankSpeed, fakeBulletPos, fakeBulletDir,
				timeToHit, bestDirToDodge, bestTimeToDodge);

//			if (tankPos == glm::vec2(4 , 7))
//			{
//				PrintVector("Tank pos: ", tankPos);
//				PrintVector("Fake bullet pos: ", fakeBulletPos);
//				std::cout << "Time to hit: " << timeToHit << std::endl;
//				std::cout << "Best time to dodge: " << bestTimeToDodge << std::endl;
//				PrintVector("Best dir to dodge: ", bestDirToDodge);
//			}
//	
			if (bestDirToDodge != glm::vec2())/*If can dodge side by side*/
			{
				if (bestTimeToDodge >= timeToHit)
				{
					pTank->SetBestTimeToDodgePosition(bestTimeToDodge);
					pTank->SetTimeToHitDodgePosition(timeToHit);
					return bias;
				}			
			}else/*If cant dodge side by side*/
			{
				
			}
		}else
		{
			float dangerDistance = 2.5;
			int dangerCoolDown = 3;
			float distance = Manhattan(tankPos, fakeBulletPos);
//			if (tankPos == glm::vec2(4, 7))
//			{
//				std::cout << "Distance: " << distance << std::endl;
//			}		
			if (tankCoolDown == 0 && enemyCoolDown <= dangerCoolDown
				&& distance <= dangerDistance)
			{
//				if (tankPos == glm::vec2(4, 7))
//				{
//					std::cout << "Yup that is dangerous.\n";
//				}
				return bias;
			}	
		}
	}
	return 1;
}

void EvaluatorDodgePosition::SetGoal(MyTank* pTank)
{
	pTank->GetBrain()->AddGoalDodgePosition();
}
