#include "TargetingSystem.h"
#include "ai/AI.h"
#include "AStarAlgorithm.h"
#include "HelperFunctions.h"
#include "Globals.h"
#include <queue>
#include "EvaluationPosition.h"
#include <glm/detail/func_geometric.inl>
#include "MyTeam.h"

TargetingSystem::~TargetingSystem()
{
}

TargetingSystem::TargetingSystem()
{
	m_vChosenEnemyInfo = std::vector<int>(NUMBER_OF_TANK, 0);
	m_iRandomMainBaseTarget = rand() % 4;

	if (AI::GetInstance()->GetMyTeam() == TEAM_1)
	{
		m_vEnemyMainBasePositions.push_back(glm::vec2(20, 10));
		m_vEnemyMainBasePositions.push_back(glm::vec2(20, 11));
		m_vEnemyMainBasePositions.push_back(glm::vec2(19, 10));
		m_vEnemyMainBasePositions.push_back(glm::vec2(19, 11));

		m_vEnemySideBasePositions.push_back(glm::vec2(17, 3));
		m_vEnemySideBasePositions.push_back(glm::vec2(17, 4));
		m_vEnemySideBasePositions.push_back(glm::vec2(18, 3));
		m_vEnemySideBasePositions.push_back(glm::vec2(18, 4));
		m_vEnemySideBasePositions.push_back(glm::vec2(17, 17));
		m_vEnemySideBasePositions.push_back(glm::vec2(17, 18));
		m_vEnemySideBasePositions.push_back(glm::vec2(18, 17));
		m_vEnemySideBasePositions.push_back(glm::vec2(18, 18));
	}
	else if (AI::GetInstance()->GetMyTeam() == TEAM_2)
	{
		m_vEnemyMainBasePositions.push_back(glm::vec2(1, 10));
		m_vEnemyMainBasePositions.push_back(glm::vec2(2, 10));
		m_vEnemyMainBasePositions.push_back(glm::vec2(1, 11));
		m_vEnemyMainBasePositions.push_back(glm::vec2(2, 11));

		m_vEnemySideBasePositions.push_back(glm::vec2(3, 3));
		m_vEnemySideBasePositions.push_back(glm::vec2(3, 4));
		m_vEnemySideBasePositions.push_back(glm::vec2(4, 3));
		m_vEnemySideBasePositions.push_back(glm::vec2(4, 4));
		m_vEnemySideBasePositions.push_back(glm::vec2(3, 17));
		m_vEnemySideBasePositions.push_back(glm::vec2(3, 18));
		m_vEnemySideBasePositions.push_back(glm::vec2(4, 17));
		m_vEnemySideBasePositions.push_back(glm::vec2(4, 18));
	}
}

std::vector<glm::vec2> TargetingSystem::GetEnemyMainBasePositions()
{
	return m_vEnemyMainBasePositions;
}

std::vector<glm::vec2> TargetingSystem::GetEnemySideBasePositions()
{
	return m_vEnemySideBasePositions;
}

TargetingSystem* TargetingSystem::GetInstance()
{
	static TargetingSystem instance = TargetingSystem();
	return &instance;
}


bool TargetingSystem::isShootableAEnemy(glm::vec2 checkPosition, glm::vec2 enemyPosition)
{
	std::vector<int> blockTypes;
	blockTypes.push_back(BLOCK_HARD_OBSTACLE);
	blockTypes.push_back(BLOCK_SOFT_OBSTACLE);
	blockTypes.push_back(BLOCK_BASE);
//	return isEmptyBetweenPoints(checkPosition, enemyPosition, blockTypes);
	return isShootableFromABulletToASquare(checkPosition, enemyPosition, blockTypes);
}

bool TargetingSystem::isShootableBase(glm::vec2 checkPosition, glm::vec2 enemyBasePositon)
{
	std::vector<int> blockTypes;
	blockTypes.push_back(BLOCK_HARD_OBSTACLE);
	return isEmptyBetweenPoints(checkPosition, enemyBasePositon, blockTypes);
}

bool TargetingSystem::isEmptyBetweenPoints(glm::vec2 p1, glm::vec2 p2, std::vector<int> blockTypes)
{
	float halfTankWidth = 0.5;
	if (isPointInsideXView(p1, p2))
	{
		if (!isSpecialDividedByOneHalf(p1.y) && !isSpecialDividedByOneHalf(p2.y))
		{
			return isEmptyBetweenTwoPoints(p1, p2, blockTypes);
		}else if (!isSpecialDividedByOneHalf(p1.y) && isSpecialDividedByOneHalf(p2.y))
		{
			glm::vec2 roundP1 = GetRoundPosition(p1);
			if (roundP1.y == p2.y - halfTankWidth)
			{
				return isEmptyBetweenTwoPoints(p1, glm::vec2(p2.x, p2.y - halfTankWidth), blockTypes);
			}else if (roundP1.y == p2.y + halfTankWidth)
			{
				return isEmptyBetweenTwoPoints(p1, glm::vec2(p2.x, p2.y + halfTankWidth), blockTypes);
			}
		}else if(isSpecialDividedByOneHalf(p1.y) && !isSpecialDividedByOneHalf(p2.y))
		{
			glm::vec2 roundP2 = GetRoundPosition(p2);
			if (roundP2.y == p1.y - halfTankWidth)
			{
				return isEmptyBetweenTwoPoints(p2, glm::vec2(p1.x, p1.y - halfTankWidth), blockTypes);
			}
			else if (roundP2.y == p1.y + halfTankWidth)
			{
				return isEmptyBetweenTwoPoints(p2, glm::vec2(p1.x, p1.y + halfTankWidth), blockTypes);
			}
		}else
		{
			return isEmptyBetweenTwoPoints(glm::vec2(p1.x, p1.y - halfTankWidth), glm::vec2(p2.x, p2.y - halfTankWidth), blockTypes)
				&& isEmptyBetweenTwoPoints(glm::vec2(p1.x, p1.y + halfTankWidth), glm::vec2(p2.x, p2.y + halfTankWidth), blockTypes);
		}
	}else if(isPointInsideYView(p1, p2))
	{
		if (!isSpecialDividedByOneHalf(p1.x) && !isSpecialDividedByOneHalf(p2.x))
		{
			return isEmptyBetweenTwoPoints(p1, p2, blockTypes);
		}
		else if (!isSpecialDividedByOneHalf(p1.x) && isSpecialDividedByOneHalf(p2.x))
		{
			glm::vec2 roundP1 = GetRoundPosition(p1);
			if (roundP1.x == p2.x - halfTankWidth)
			{
				return isEmptyBetweenTwoPoints(p1, glm::vec2(p2.x - halfTankWidth, p2.y), blockTypes);
			}
			else if (roundP1.x == p2.x + halfTankWidth)
			{
				return isEmptyBetweenTwoPoints(p1, glm::vec2(p2.x + halfTankWidth, p2.y), blockTypes);
			}
		}
		else if (isSpecialDividedByOneHalf(p1.x) && !isSpecialDividedByOneHalf(p2.x))
		{
			glm::vec2 roundP2 = GetRoundPosition(p2);
			if (roundP2.x == p1.x - halfTankWidth)
			{
				return isEmptyBetweenTwoPoints(p2, glm::vec2(p1.x - halfTankWidth, p1.y), blockTypes);
			}
			else if (roundP2.x == p1.x + halfTankWidth)
			{
				return isEmptyBetweenTwoPoints(p2, glm::vec2(p1.x + halfTankWidth, p1.y), blockTypes);
			}
		}
		else
		{
			return isEmptyBetweenTwoPoints(glm::vec2(p1.x - halfTankWidth, p1.y), glm::vec2(p2.x - halfTankWidth, p2.y), blockTypes)
				&& isEmptyBetweenTwoPoints(glm::vec2(p1.x + halfTankWidth, p1.y), glm::vec2(p2.x + halfTankWidth, p2.y), blockTypes);
		}
	}
	return false;
}

bool TargetingSystem::isEmptyBetweenTwoPoints(glm::vec2 p1, glm::vec2 p2, std::vector<int> blockTypes)
{
	int roundX1 = GetRoundPosition(p1).x;
	int roundY1 = GetRoundPosition(p1).y;
	int roundX2 = GetRoundPosition(p2).x;
	int roundY2 = GetRoundPosition(p2).y;
	int maxX, maxY, minX, minY;

	if (!isPointInsideXView(p1, p2) && !isPointInsideYView(p1, p2))
		return false;

	if (roundY1 == roundY2)
	{
		minX = roundX1 > roundX2 ? roundX2 : roundX1;
		maxX = roundX1 > roundX2 ? roundX1 : roundX2;
		for (int x = minX; x <= maxX; x++)
		{
			for (int type : blockTypes)
			{
				if (AI::GetInstance()->GetBlock(x, roundY1) == type)
					return false;
			}
		}
		return true;
	}
	else if (roundX1 == roundX2)
	{
		minY = roundY1 > roundY2 ? roundY2 : roundY1;
		maxY = roundY1 > roundY2 ? roundY1 : roundY2;
		for (int y = minY; y <= maxY; y++)
		{
			for (int type : blockTypes)
			{
				if (AI::GetInstance()->GetBlock(roundX1, y) == type)
					return false;
			}
		}
		return true;
	}

	return false;
}


bool TargetingSystem::isShootableFromABulletToASquare(glm::vec2 bulletPos, glm::vec2 squarePos, std::vector<int> blockTypes)
{
	if (isInView(bulletPos, squarePos) && !isPointInsideTank(bulletPos, squarePos))
	{
		if(isPointInsideXView(bulletPos, squarePos) && isSpecialDividedByOneHalf(bulletPos.y))
		{
			glm::vec2 fakeBulletPosUp = glm::vec2(bulletPos.x, bulletPos.y - HALF_TANK_WIDTH);
			glm::vec2 fakeBulletPosDown = glm::vec2(bulletPos.x, bulletPos.y + HALF_TANK_WIDTH);
			glm::vec2 fakeSquarePosUp = glm::vec2(squarePos.x, fakeBulletPosUp.y);
			glm::vec2 fakeSquarePosDown = glm::vec2(squarePos.x, fakeBulletPosDown.y);
			return 	isShootableFromABulletToASquareNormalCase(fakeBulletPosUp, fakeSquarePosUp, blockTypes)
				&& isShootableFromABulletToASquareNormalCase(fakeBulletPosDown, fakeSquarePosDown, blockTypes);
		}else if(isPointInsideYView(bulletPos, squarePos) && isSpecialDividedByOneHalf(bulletPos.x))
		{
			glm::vec2 fakeBulletPosLeft = glm::vec2(bulletPos.x - HALF_TANK_WIDTH, bulletPos.y);
			glm::vec2 fakeBulletPosRight = glm::vec2(bulletPos.x + HALF_TANK_WIDTH, bulletPos.y);
			glm::vec2 fakeSquarePosLeft = glm::vec2(fakeBulletPosLeft.x, squarePos.y);
			glm::vec2 fakeSquarePosRight = glm::vec2(fakeBulletPosRight.x, squarePos.y);
			return isShootableFromABulletToASquareNormalCase(fakeBulletPosLeft, fakeSquarePosLeft, blockTypes)
				&& isShootableFromABulletToASquareNormalCase(fakeBulletPosRight, fakeSquarePosRight, blockTypes);
		}else
		{
			return isShootableFromABulletToASquareNormalCase(bulletPos, squarePos, blockTypes);
		}
	}
	return false;
}

bool TargetingSystem::isShootableFromABulletToASquareNormalCase(glm::vec2 bulletPos, glm::vec2 squarePos, std::vector<int> blockTypes)
{
	if (isInView(bulletPos, squarePos) && !isPointInsideTank(bulletPos, squarePos))
	{
		glm::vec2 dirToRun;
		if (isPointInsideXView(bulletPos, squarePos))
		{
			dirToRun = glm::normalize(glm::vec2(squarePos.x - bulletPos.x, 0));
		}else if(isPointInsideYView(bulletPos, squarePos))
		{
			dirToRun = glm::normalize(glm::vec2(0, squarePos.y - bulletPos.y));
		}
		glm::vec2 integerPosContainsTheBullet = GetRoundPosition(bulletPos);
		glm::vec2 currentRunPos = integerPosContainsTheBullet;
		int timeToRun = GetTimeAInViewBulletToHitATank(squarePos, currentRunPos + dirToRun, dirToRun, 1);
		for (int i=0; i<timeToRun; i++)
		{
			glm::vec2 checkedPos = currentRunPos + dirToRun;
			int type = AI::GetInstance()->GetBlock(checkedPos.x, checkedPos.y);
			auto it = std::find(blockTypes.begin(), blockTypes.end(), type);
			if (it != blockTypes.end())
				return false;
			currentRunPos = checkedPos;
		}
		return true;
	}
	return false;
}

Tank* TargetingSystem::GetClosestEnemyTank(glm::vec2 tankPos)
{
	float closestDistance = 999;
	Tank* closestEnemyTank = nullptr;
	for (Tank* enemyTank : GetAllAliveEnemyTank())
	{
		float distance = Manhattan(glm::vec2(enemyTank->GetX(), enemyTank->GetY()), tankPos);
		if (distance < closestDistance)
		{
			closestDistance = distance;
			closestEnemyTank = enemyTank;
		}
	}
	return closestEnemyTank;
}

std::vector<glm::vec2> TargetingSystem::GetPositionsForAttackEnemy(MyTank* myTank, glm::vec2 enemyPosition)
{
//	std::vector<glm::vec2> positions;
//	glm::vec2 roundEnemyPosition = GetRoundPosition(enemyPosition);
//	
//	for (glm::vec2 dir : dirs)
//	{
//		glm::vec2 p = roundEnemyPosition + dir;
//		while(isValidGroundPosition(p))
//		{
//			if (!isTheSamePositionWithOtherTank(myTank->GetPosition(), p))
//				positions.push_back(p);
//			p = p + dir;
//		}
//	}
//
//	return positions;
//	return GenarateGroundedPositionsUsingBFS(enemyPosition, 30);
	std::vector<glm::vec2> positions;
	for (glm::vec2 dir : dirs)
	{
		glm::vec2 p = enemyPosition + dir;
		while (isPosInMap(p))
		{
			if (isValidTankPosition(p) && isShootableAEnemy(p, enemyPosition))
				positions.push_back(p);
			p = p + dir;
		}
	}
	return positions;
}

std::vector<glm::vec2> TargetingSystem::GetSafePositionsForEvaluation(MyTank* myTank)
{
	return GenarateGroundedPositionsUsingBFS(GetRoundPosition(myTank->GetPosition()), 40);
}

std::vector<glm::vec2> TargetingSystem::GenarateGroundedPositionsUsingBFS(glm::vec2 root, int numPositions)
{
	std::vector<glm::vec2> genaratedPositions;
	std::list<glm::vec2> theFrontier;
	bool closedPositions[MAP_W][MAP_H] = { false };

	theFrontier.push_back(root);

	while(!theFrontier.empty())
	{
		glm::vec2 node = theFrontier.front();
		theFrontier.pop_front();
		int x = int(node.x);
		int y = int(node.y);
		closedPositions[x][y] = true;
		genaratedPositions.push_back(node);

		if (genaratedPositions.size() == numPositions)
			return genaratedPositions;

		for (glm::vec2 ajacentPosition : GetGroundAjacentPositions(node))
		{
			x = int(ajacentPosition.x);
			y = int(ajacentPosition.y);
			if (!closedPositions[x][y])
			{
				theFrontier.push_back(ajacentPosition);
			}
		}
	}
	return genaratedPositions;
}

bool TargetingSystem::isValidGroundPosition(glm::vec2 position)
{
	std::vector<int> types;
	types.push_back(BLOCK_GROUND);
	return isValidPositionByType(position, types);
}

bool TargetingSystem::isPosInMap(glm::vec2 position)
{
	if (position.x < 0 || position.x >= MAP_W ||
		position.y < 0 || position.y >= MAP_H)
		return false;
	return true;
}

bool TargetingSystem::isValidPositionByType(glm::vec2 position, std::vector<int> types)
{
	if (!isPosInMap(position))
		return false;
	int typeBlock = AI::GetInstance()->GetBlock(position.x, position.y);
	for (int type : types)
	{
		if (typeBlock == type)
			return true;
	}
	return false;
}

std::vector<glm::vec2> TargetingSystem::GetAllTankPositions()
{
	std::vector<glm::vec2> positions;
	for (int i=0; i<NUMBER_OF_TANK; i++)
	{
		Tank* teamTank = nullptr;
		Tank* enemyTank = nullptr;
	
		teamTank = AI::GetInstance()->GetMyTank(i);
		enemyTank = AI::GetInstance()->GetEnemyTank(i);

		if (teamTank)
		{
			positions.push_back(glm::vec2(teamTank->GetX(), teamTank->GetY()));
		}
		if (enemyTank)
		{
			positions.push_back(glm::vec2(enemyTank->GetX(), enemyTank->GetY()));
		}
	}
	return positions;
}

bool TargetingSystem::isTheSamePositionWithOtherTank(glm::vec2 myTankPosition, glm::vec2 checkedPosition)
{
	for (glm::vec2 p : GetAllTankPositions())
	{
		if (p != myTankPosition)
		{
			if (isTwoSquareOverLap(checkedPosition, p))
			{
				return true;
			}		
		}
	}
	return false;
}

bool TargetingSystem::isTheSamePositionWithOtherTanks(glm::vec2 checkPos, std::vector<glm::vec2> otherTankPos)
{
	for (glm::vec2 p : otherTankPos)
	{
		if (isTwoSquareOverLap(checkPos, p))
		{
			return true;
		}
	}
	return false;
}

std::vector<glm::vec2> TargetingSystem::GetGroundAjacentPositions(glm::vec2 position)
{
	std::vector<glm::vec2> ajacentPositions;
	for (glm::vec2 dir : dirs)
	{
		glm::vec2 p = position + dir;
		if (isValidGroundPosition(p))
			ajacentPositions.push_back(p);
	}
	return ajacentPositions;
}

void TargetingSystem::UpdateTargetForATank(MyTank* myTank)
{
	std::priority_queue<EvaluationPosition> pq;
	for (int i=0; i<NUMBER_OF_TANK; i++)
	{
		Tank* enemyTank = AI::GetInstance()->GetEnemyTank(i);
		if (enemyTank->GetHP() > 0)
		{
			glm::vec2 enemyPos = glm::vec2(enemyTank->GetX(), enemyTank->GetY());
			EvaluationPosition ep = EvaluationPosition(enemyPos);
			ep.EvaluateDistanceToMyTankScore(myTank, 10);
//			if (MyTeamMgr->GetCurrentState() == DEFENDING)
//			{
//				ep.EvaluateCloseToMainBase(GetMyMainBasePosition(), 70);
//			}
			ep.EvaluateShootableEnemy(myTank->GetPosition(), 50);
//			ep.EvaluateNumberOfMyTankChosenScore(i, 15);
			ep.SetTargetEnemyId(i);//this is a little bit dump ##!.
			pq.push(ep);
		}
	}

	if (!pq.empty())
	{
		myTank->SetCurrentEnemyId(pq.top().GetTargetEnemyId());
		ChoseEnemyToTarget(pq.top().GetTargetEnemyId());
	}
}

glm::vec2 TargetingSystem::GetBestPositionForSniperToAttack(MyTank* myTank, glm::vec2 enemyPosition)
{
	std::vector<glm::vec2> evaluatedPositions = GetPositionsForAttackEnemy(myTank, enemyPosition);
	std::priority_queue<EvaluationPosition> pq;

	for (glm::vec2 p : evaluatedPositions)
	{
		if (!isTheSamePositionWithOtherTank(myTank->GetPosition(), p))
		{
			EvaluationPosition ep = EvaluationPosition(p);
			ep.EvaluateDistanceToMyTankScore(myTank, 10);
//			ep.EvaluateRangeAttackForSniperScore(enemyPosition, 10);
//			ep.EvaluateNumLineOfFireScore(5);
//			ep.EvaluateDangerouseBullets(-50);
			pq.push(ep);
		}		
	}

	if (!pq.empty())
		return pq.top().GetPosition();

	return glm::vec2();
}

glm::vec2 TargetingSystem::GetBestPositionForSniperToCover(MyTank* myTank)
{
	std::vector<glm::vec2> positionsToEvaluated = GetSafePositionsForEvaluation(myTank);
	std::priority_queue<EvaluationPosition> pq;

	for (glm::vec2 p : positionsToEvaluated)
	{
		if (!isTheSamePositionWithOtherTank(myTank->GetPosition(), p))
		{
			EvaluationPosition ep = EvaluationPosition(p);
			ep.EvaluateDistanceToMyTankScore(myTank, 10);
			ep.EvaluateNumLineOfFireScore(-10);
			ep.EvaluateDangerouseBullets(-50);
			ep.EvaluateCloseToMainBase(TargetMgr->GetMyMainBasePosition(), 5);
//			ep.EvaluateOrthogonalWithMyTankScore(myTank->GetPosition(), 5);
			//		if (myTank->isCurrentEnemyTargetPresent())
			//		{
			//			Tank* enemyTank = AI::GetInstance()->GetEnemyTank(myTank->GetCurrentEnemyId());
			//			glm::vec2 enemyPosition = glm::vec2(enemyTank->GetX(), enemyTank->GetY());
			//			ep.EvaluateCloserToEnemyToReload(enemyPosition, 25);
			//		}
			pq.push(ep);
		}
	}

	if (!pq.empty())
		return pq.top().GetPosition();

	return glm::vec2();
}

glm::vec2 TargetingSystem::GetPositionToCoverFromTargets(glm::vec2 tankPos, float tankSpeed, std::vector<glm::vec2> targets)
{
	glm::vec2 bestPosToCover;
	std::list<glm::vec2> frontier;
	std::vector<glm::vec2> closedList;
	frontier.push_back(tankPos);
	//	std::cout << "befor while loop.\n";
	while (!frontier.empty())
	{
		closedList.push_back(frontier.front());
		glm::vec2 node = frontier.front();
		frontier.pop_front();
		//		PrintVector("Expaned pos: ", node);
		if (!isTheSamePositionWithOtherTank(tankPos, node)
			&& (CalculateNumLineOfFireCrossAPosByEnemyPos(node, targets) == 0)
			&& (GetAllDangerBulletPositions(node).size() == 0))
		{
			bestPosToCover = node;
			break;
		}
		for (glm::vec2 dir : dirs)
		{
			glm::vec2 childPos = node + tankSpeed * dir;

			auto it = std::find(closedList.begin(), closedList.end(), childPos);
			auto it2 = std::find(frontier.begin(), frontier.end(), childPos);
			if ((it == closedList.end()) && isValidTankPosition(childPos)
				&& !isTheSamePositionWithOtherTank(tankPos, childPos) && (it2 == frontier.end()))
			{
				frontier.push_back(childPos);
			}
		}
	}
	//	std::cout << "after while loop.\n";
	return bestPosToCover;
}

int TargetingSystem::CalculateNumLineOfFireCrossAPosByEnemyPos(glm::vec2 position, std::vector<glm::vec2> enemyPos)
{
	int numLineOfFire = 0;
	for (glm::vec2 enemyP : enemyPos)
	{
		if (isShootableAEnemy(enemyP, position))
			numLineOfFire += 1;
	}
	return numLineOfFire;
}

void TargetingSystem::ChoseEnemyToTarget(int enemyId)
{
	m_vChosenEnemyInfo[enemyId] += 1;
}

void TargetingSystem::UnchoseEnemyToTarget(int enemyId)
{
	m_vChosenEnemyInfo[enemyId] -= 1;
}

int TargetingSystem::GetNumChosen(int enemyId)
{
	return m_vChosenEnemyInfo[enemyId];
}

std::vector<glm::vec2> TargetingSystem::GetAllAliveEnemyPositions()
{
	std::vector<glm::vec2> enemyPositions;
	for (int i=0; i< NUMBER_OF_TANK; i++)
	{
		Tank* enemyTank = AI::GetInstance()->GetEnemyTank(i);
		if (enemyTank->GetHP() > 0)
		{
			enemyPositions.push_back(glm::vec2(enemyTank->GetX(), enemyTank->GetY()));
		}
	}
	return enemyPositions;
}

std::vector<Tank*> TargetingSystem::GetAllAliveEnemyTank()
{
	std::vector<Tank*> tanks;
	for (int i = 0; i< NUMBER_OF_TANK; i++)
	{
		Tank* enemyTank = AI::GetInstance()->GetEnemyTank(i);
		if (enemyTank->GetHP() > 0)
		{
			tanks.push_back(enemyTank);
		}
	}
	return tanks;
}

int TargetingSystem::GetEnemyIdMostChosen()
{
	int mostChosen = 0;
	int mostChosenEnemyId = 0;
	for (int i=0; i<NUMBER_OF_TANK; i++)
	{
		if (m_vChosenEnemyInfo[i] > mostChosen)
		{
			mostChosen = m_vChosenEnemyInfo[i];
			mostChosenEnemyId = i;
		}
	}
	return mostChosenEnemyId;
}

/*Functions for attack main base*/
glm::vec2 TargetingSystem::GetBestTargetMainBasePosition(MyTank* myTank)
{
	return GetEnemyMainBasePositions()[m_iRandomMainBaseTarget];
}

glm::vec2 TargetingSystem::GetBestPositionToAttackMainBase(MyTank* myTank, glm::vec2 mainBaseTargetPosition)
{
	std::vector<glm::vec2> positionsToAttack = GetPositionsCanAttackMainBase(myTank, mainBaseTargetPosition);
	std::priority_queue<EvaluationPosition> pq;

	for (glm::vec2 p : positionsToAttack)
	{
		EvaluationPosition ep = EvaluationPosition(p);
		ep.EvaluateDistanceToEnemyBaseTarget(mainBaseTargetPosition);
		ep.EvaluateSameXAxisWithBaseTarget(mainBaseTargetPosition);
		ep.EvaluateWithCenter(mainBaseTargetPosition, 2);
		pq.push(ep);
	}

	if (!pq.empty())
		return pq.top().GetPosition();

	return glm::vec2();
}

std::vector<glm::vec2> TargetingSystem::GetPositionsCanAttackMainBase(MyTank* myTank, glm::vec2 mainBaseTargetPosition)
{
	std::vector<glm::vec2> attackablePositions;
	std::vector<glm::vec2> resultPositions;
	std::vector<int> validTypes;
	validTypes.push_back(BLOCK_GROUND);
	validTypes.push_back(BLOCK_BASE);
	validTypes.push_back(BLOCK_SOFT_OBSTACLE);
	for (glm::vec2 dir : dirs)
	{
		glm::vec2 p = mainBaseTargetPosition + dir;
		while(isValidPositionByType(p, validTypes))
		{
			attackablePositions.push_back(p);
			p = p + dir;
		}
	}
	for (glm::vec2 p : attackablePositions)
	{
		if (isValidGroundPosition(p) && !isTheSamePositionWithOtherTank(myTank->GetPosition(), p))
			resultPositions.push_back(p);
	}
	return resultPositions;
}

glm::vec2 TargetingSystem::GetMyMainBasePosition()
{
	if (AI::GetInstance()->GetMyTeam() == TEAM_1)
	{
		return glm::vec2(1.5, 10.5);
	}
	if (AI::GetInstance()->GetMyTeam() == TEAM_2)
	{
		return glm::vec2(19.5, 10.5);
	}
	return glm::vec2();
}

std::vector<Bullet*> TargetingSystem::GetAllDangerBulletPositions(glm::vec2 tankPosition)
{
	std::vector<Bullet*> bullets;
	std::vector<Bullet*> enemyBullets = AI::GetInstance()->GetEnemyBullets();

	for (Bullet* bullet : enemyBullets)
	{
		glm::vec2 bulletPos = glm::vec2(bullet->GetX(), bullet->GetY());
		if (bullet->IsAlive())
		{
			if (isInView(bulletPos, tankPosition))
			{
				glm::vec2 bulletDir = GetDirByDefineDir(bullet->GetDirection());
				glm::vec2 vecBulletToTankPos;

				if (isPointInsideXView(bulletPos, tankPosition))
				{
					vecBulletToTankPos = glm::vec2(bulletPos.x - tankPosition.x, 0);
				}
				else if (isPointInsideYView(bulletPos, tankPosition))
				{
					vecBulletToTankPos = glm::vec2(0, bulletPos.y - tankPosition.y);
				}
				if (glm::length(vecBulletToTankPos) > 0)
				{
					vecBulletToTankPos = glm::normalize(vecBulletToTankPos);
					float dot = glm::dot(vecBulletToTankPos, bulletDir);
					if (dot == -1 || dot < 0) //dont know why some time == -1 doesnt work.!
					{
						bullets.push_back(bullet);
					}
				}
				else
				{
					bullets.push_back(bullet);
				}
			}
			else if (isPointInsideTank(bulletPos, tankPosition))
			{
				bullets.push_back(bullet);
			}
		}
	}

	return bullets;
}

Bullet* TargetingSystem::GetClosestDangerBullet(glm::vec2 tankPosition)
{
	std::vector<Bullet*> bullets = GetAllDangerBulletPositions(tankPosition);
	if(!bullets.empty())
	{
		Bullet* closetBullet = bullets[0];
		float closetTime = 9999;
		for (Bullet* bullet : bullets)
		{
			glm::vec2 bulletPos = glm::vec2(bullet->GetX(), bullet->GetY());
			glm::vec2 bulletDir = GetDirByDefineDir(bullet->GetDirection());
			float bulletSpeed = bullet->GetSpeed();
			int timeToHit = GetTimeAInViewBulletToHitATank(tankPosition, bulletPos, bulletDir, bulletSpeed);
			if (timeToHit < closetTime)
			{
				closetBullet = bullet;
				closetTime = timeToHit;
			}
				
		}
		return closetBullet;
	}else
	{
	}
	return nullptr;
}

bool TargetingSystem::isTheClosestBulletDangerous(MyTank* myTank, Bullet* closestBullet)
{
	glm::vec2 bulletPos = glm::vec2(closestBullet->GetX(), closestBullet->GetY());
	glm::vec2 bulletDir = GetDirByDefineDir(closestBullet->GetDirection());
	float bulletSpeed = closestBullet->GetSpeed();
	glm::vec2 tankPos = myTank->GetPosition();
	float tankSpeed = myTank->GetSpeed();

	glm::vec2 bestDirToDodge;
	int bestTimeToDodge = 99;
	int timeToHit = GetTimeAInViewBulletToHitATank(tankPos, bulletPos, bulletDir, bulletSpeed);

	/*If can dodge side by side then this value will be true,
	if not the bot will find best dir to cover as soon as possible
	*/
	bool canDodgeSideBySide = false;

	CalculateBestTimeAndDirToDodgeBullet(tankPos, tankSpeed, bulletPos, bulletDir, timeToHit,
				bestDirToDodge, bestTimeToDodge);

	if (bestDirToDodge != glm::vec2())
	{
		if (timeToHit <= bestTimeToDodge)
		{
			myTank->SetCurrentClosestDangerBullet(closestBullet);
			myTank->SetBestDirToDodgeDangerBullet(bestDirToDodge);
			return true;
		}
	}else //if cant dodge side by side, then go to good pos to cover.
	{
//		std::cout << "Before find cover.\n";
//		PrintVector("Closest bullet pos: ", bulletPos);
//		PrintVector("Tank pos to find pos to cover: ", tankPos);
		glm::vec2 bestPosToCover = FindPosToConverIfCantDodgeSideBySide(tankPos, tankSpeed, bulletPos, bulletDir);
//		std::cout << "after find cover.\n";
		if (bestPosToCover != glm::vec2())
		{
//			PrintVector("Closest bullet pos: ", bulletPos);
//			PrintVector("Best pos to cover:", bestPosToCover);
			if (bulletDir.y == 0)
			{
				bestDirToDodge = glm::normalize(glm::vec2(bestPosToCover.x - tankPos.x, 0));
			}else if(bulletDir.x == 0)
			{
				bestDirToDodge = glm::normalize(glm::vec2(0, bestPosToCover.y - tankPos.y));
			}
			myTank->SetCurrentClosestDangerBullet(closestBullet);
			myTank->SetBestDirToDodgeDangerBullet(bestDirToDodge);
			return true;
		}
	}
	return false;
}

void TargetingSystem::CalculateBestTimeAndDirToDodgeBullet(glm::vec2 tankPos, float tankSpeed, 
	glm::vec2 bulletPos, glm::vec2 bulletDir, int timeToHit, 
	glm::vec2 & bestDirToDodge, int & bestTimeToDodge)
{
	for (glm::vec2 dirToDodge : dirs)
	{
		float dot = glm::dot(dirToDodge, bulletDir);
		/*Dodge side by side*/
		if (dot == 0)
		{
			float distanceToDodge =
				CalculateDistanceToDodgeBulletByDir(tankPos, bulletPos, bulletDir, dirToDodge);
			int timeToDodge = CalculateTimeToDodgeByDistance(tankSpeed, distanceToDodge);
			if (isPossibleToMoveByDirAndTime(tankPos, tankSpeed, dirToDodge, timeToDodge))
			{
				if (timeToDodge < bestTimeToDodge)
				{
					bestTimeToDodge = timeToDodge;
					bestDirToDodge = dirToDodge;
				}
			}
		}
	}
}

bool TargetingSystem::isTheFakeClosestBulletDangerous(MyTank* myTank, glm::vec2 bulletPos, glm::vec2 bulletDir, float bulletSpeed)
{
	glm::vec2 tankPos = myTank->GetPosition();
	float tankSpeed = myTank->GetSpeed();

	if (isShootableAEnemy(bulletPos, tankPos))
	{
		glm::vec2 bestDirToDodge;
		int bestTimeToDodge = 99;
		int timeToHit = GetTimeAInViewBulletToHitATank(tankPos, bulletPos, bulletDir, bulletSpeed);

		/*If can dodge side by side then this value will be true,
		if not the bot will find best dir to cover as soon as possible
		*/
		bool canDodgeSideBySide = false;

		CalculateBestTimeAndDirToDodgeBullet(tankPos, tankSpeed, bulletPos, bulletDir, timeToHit,
			bestDirToDodge, bestTimeToDodge);

		if (bestDirToDodge != glm::vec2())
		{
			if (timeToHit <= bestTimeToDodge)
			{
				return true;
			}
		}
		else //if cant dodge side by side, then go to good pos to cover.
		{
			glm::vec2 bestPosToCover =
				FindPosToConverIfCantDodgeSideBySide(tankPos, tankSpeed, bulletPos, bulletDir);
			if (bestPosToCover != glm::vec2())
			{
				return true;
			}
		}
	}
	return false;
}

bool TargetingSystem::isTheFakeClosestBulletPossibleToDodgeSideBySide(glm::vec2 originTankPos, glm::vec2 futureTankPos, float tankSpeed,
	glm::vec2 bulletPos, glm::vec2 bulletDir, float bulletSpeed)
{
	if (isShootableAEnemy(bulletPos, futureTankPos))
	{
//		PrintVector("Tank origin pos: ", originTankPos);
//		PrintVector("Tank future pos: ", futureTankPos);
//		PrintVector("Fake bullet pos: ", bulletPos);
		glm::vec2 bestDirToDodge;
		int bestTimeToDodge = 999;
		int timeToHit = GetTimeAInViewBulletToHitATank(futureTankPos, bulletPos, bulletDir, bulletSpeed);
//		std::cout << "Time to hit: " << timeToHit << std::endl;
		for (glm::vec2 dirToDodge : dirs)
		{
			float dot = glm::dot(dirToDodge, bulletDir);
			/*Dodge side by side*/
			if (dot == 0)
			{
				float distanceToDodge =
					CalculateDistanceToDodgeBulletByDir(futureTankPos, bulletPos, bulletDir, dirToDodge);
				int timeToDodge = CalculateTimeToDodgeByDistance(tankSpeed, distanceToDodge);
//				std::cout << "Time to dodge by dir ";
//				PrintVector("", dirToDodge);
//				std::cout << " " << timeToDodge << std::endl;
				if (isPossibleToMoveByDirAndTime(originTankPos, futureTankPos, tankSpeed, dirToDodge, timeToDodge))
				{
//					std::cout << "Inside possible to move by dir and time.\n";
					if (timeToDodge < bestTimeToDodge)
					{
						bestTimeToDodge = timeToDodge;
						bestDirToDodge = dirToDodge;
					}
				}
			}
		}

		if (bestDirToDodge != glm::vec2())
		{
			if (timeToHit < bestTimeToDodge)
			{
//				std::cout << "Time to hit: " << timeToHit << std::endl;
//				std::cout << "Best time to doge: " << bestTimeToDodge << std::endl;
				return false;
			}
//			std::cout << "Can dodge: !!!!!!11" << std::endl;
			return true;
		}
//		std::cout << "Cant find side to dodge:!!!\n";
		return false;
	}else if (isPointInsideTank(bulletPos, futureTankPos))
	{
		return false;
	}
	return true;
}

glm::vec2 TargetingSystem::FindPosToConverIfCantDodgeSideBySide(glm::vec2 tankPos, float tankSpeed, glm::vec2 bulletPos, glm::vec2 bulletDir)
{
	glm::vec2 bestPosToCover;
	std::list<glm::vec2> frontier;
	std::vector<glm::vec2> closedList;
	frontier.push_back(tankPos);
//	std::cout << "befor while loop.\n";
	while(!frontier.empty())
	{
		closedList.push_back(frontier.front());
		glm::vec2 node = frontier.front();
		frontier.pop_front();
//		PrintVector("Expaned pos: ", node);
		if (!isShootableAEnemy(bulletPos, node) && !isPointInsideTank(node, tankPos))
		{
			bestPosToCover = node;
			break;
		}
		for (glm::vec2 dir : dirs)
		{
			glm::vec2 childPos = node + tankSpeed * dir;

			auto it = std::find(closedList.begin(), closedList.end(), childPos);
			auto it2 = std::find(frontier.begin(), frontier.end(), childPos);
			if ((it == closedList.end()) && isValidTankPosition(childPos) 
				&& !isTheSamePositionWithOtherTank(tankPos, childPos) && (it2 == frontier.end()))
			{
				frontier.push_back(childPos);
			}
		}
	}
	return bestPosToCover;
}

int TargetingSystem::GetTimeAInViewBulletToHitATank(glm::vec2 tankPos, glm::vec2 bulletPos, glm::vec2 bulletDir, float bulletSpeed)
{
	float timeToHit = 0;
	int result = 0;
	float distance = GetDistanceFromAInViewBulletToATank(tankPos, bulletPos, bulletDir);
	timeToHit = distance / bulletSpeed;
	if (int(timeToHit) == timeToHit)
	{
		result = int(timeToHit);
	}
	else
	{
		result = int(timeToHit) + 1;
	}

	return result;
}

float TargetingSystem::GetDistanceFromAInViewBulletToATank(glm::vec2 tankPos, glm::vec2 bulletPos, glm::vec2 bulletDir)
{
	float distance = 0;
	float tankHalfWidth = 0.5;
	if (bulletDir.y == 0)
	{
		distance = abs(tankPos.x - bulletPos.x) - tankHalfWidth;
	}else if (bulletDir.x == 0)
	{
		distance = abs(tankPos.y - bulletPos.y) - tankHalfWidth;
	}
	return distance;
}

float TargetingSystem::CalculateDistanceToDodgeBulletByDir(glm::vec2 tankPos, glm::vec2 bulletPos, glm::vec2 bulletDir, glm::vec2 dodgeDir)
{
	glm::vec2 bestDirToDodge;
	float distanceToDodgeByDir = 0;
	if (bulletDir.y == 0)
	{
		bestDirToDodge = glm::vec2(0, tankPos.y - bulletPos.y);
	}
	else if (bulletDir.x == 0)
	{
		bestDirToDodge = glm::vec2(tankPos.x - bulletPos.x, 0);
	}

	if (glm::length(bestDirToDodge) == 0)
	{
		distanceToDodgeByDir = HALF_TANK_WIDTH;
	}
	else
	{
		float dot = glm::dot(glm::normalize(bestDirToDodge), dodgeDir);
		if (dot == 1)
		{
			distanceToDodgeByDir = HALF_TANK_WIDTH - glm::length(bestDirToDodge);
		}else if (dot == -1)
		{
			distanceToDodgeByDir = HALF_TANK_WIDTH + glm::length(bestDirToDodge);
		}else
		{
			
		}
	}
	return distanceToDodgeByDir;
}

int TargetingSystem::CalculateTimeToDodgeByDistance(float speed, float distance)
{
	return int(distance / speed) + 1;
}

bool TargetingSystem::isPossibleToMoveByDirAndTime(glm::vec2 tankPos, float tankSpeed, glm::vec2 dirToMove, int timeToMove)
{
	glm::vec2 currentTankPos = tankPos;
	for (int i=0; i<timeToMove; i++)
	{
		glm::vec2 futurePos = currentTankPos + tankSpeed * dirToMove;
		if (!isValidTankPosition(futurePos) || isTheSamePositionWithOtherTank(tankPos, futurePos))
			return false;
		currentTankPos = futurePos;
	}
	return true;
}

bool TargetingSystem::isPossibleToMoveByDirAndTime(glm::vec2 originTankPos, glm::vec2 tankFuturePos, float tankSpeed, glm::vec2 dirToMove, int timeToMove)
{
	glm::vec2 currentTankPos = tankFuturePos;
	for (int i = 0; i<timeToMove; i++)
	{
		glm::vec2 futurePos = currentTankPos + tankSpeed * dirToMove;
		if (!isValidTankPosition(futurePos) || isTheSamePositionWithOtherTank(originTankPos, futurePos))
			return false;
		currentTankPos = futurePos;
	}
	return true;
}

/*check valid tank position*/

bool TargetingSystem::isValidTankPosition(glm::vec2 tankPos)
{
	for (glm::vec2 p : GetAllIntegerPositionsTankOverLap(tankPos))
	{
		if (!isValidGroundPosition(p))
			return false;
	}
	return true;
}

std::vector<int> TargetingSystem::ExtractCoordinate(float xOrY)
{
	float tankWidth = 0.5;
	std::vector<int> result;
	if (int(xOrY) == xOrY)
	{
		result.push_back(xOrY);
	}else
	{
		result.push_back(round(xOrY + tankWidth));
		result.push_back(round(xOrY - tankWidth));
	}
	return result;
}

std::vector<glm::vec2> TargetingSystem::GetAllIntegerPositionsTankOverLap(glm::vec2 tankPos)
{
	std::vector<glm::vec2> overLapPositions;
	for (int x : ExtractCoordinate(tankPos.x))
	{
		for (int y : ExtractCoordinate((tankPos.y)))
		{
			overLapPositions.push_back(glm::vec2(x, y));
		}
	}
	return overLapPositions;
}

glm::vec2 TargetingSystem::GetDirInViewPointToPoint(glm::vec2 standingPoint, glm::vec2 checkedPoint)
{
	glm::vec2 dirPointToPoint;
	if (isInView(checkedPoint, standingPoint))
	{
		if (isPointInsideXView(checkedPoint, standingPoint))
		{
			dirPointToPoint = glm::normalize(glm::vec2(standingPoint.x - checkedPoint.x, 0));
		}
		else
		{
			dirPointToPoint = glm::normalize(glm::vec2(0, standingPoint.y - checkedPoint.y));
		}
	}
	return dirPointToPoint;
}
