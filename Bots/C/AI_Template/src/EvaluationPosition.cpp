#include "EvaluationPosition.h"
#include "Globals.h"
#include "HelperFunctions.h"
#include <glm/detail/func_geometric.inl>

EvaluationPosition::~EvaluationPosition()
{
}

void EvaluationPosition::EvaluateNumLineOfFireScore(float weight)
{
	float score = 0;
	for (glm::vec2 p : TargetMgr->GetAllAliveEnemyPositions())
	{
		if (TargetMgr->isShootableAEnemy(m_vPosition, p))
			score += 1;
	}
	m_fScore += score*weight;
}

void EvaluationPosition::EvaluateRangeAttackForSniperScore(glm::vec2 enemyPosition, float weight)
{
	float score = int(Manhattan(enemyPosition, m_vPosition))%BEST_RANGE_SNIPER;
	m_fScore += score * weight;
}

void EvaluationPosition::EvaluateDangerouseBullets(float weight)
{
	float score = TargetMgr->GetAllDangerBulletPositions(m_vPosition).size();
	m_fScore += score * weight;
}

void EvaluationPosition::EvaluateCloserToEnemyToReload(glm::vec2 enemyPosition, float weight)
{
	float score = 0;
	float distance = Manhattan(enemyPosition, m_vPosition);
	if (distance <= SAFE_DISTANCE_TO_ENEMY_TO_RELOAD)
		score = 1;
	m_fScore += score*weight;
}

void EvaluationPosition::EvaluateOrthogonalWithMyTankScore(glm::vec2 myTankPos, float weight)
{
	float score = 0;
	glm::vec2 posToMyTank = m_vPosition - myTankPos;
	if (glm::length(posToMyTank) > 0)
	{
		posToMyTank = glm::normalize(posToMyTank);
		if (posToMyTank.x == 0 || posToMyTank.y == 0)
			score = 1;
	}
	m_fScore += score * weight;
}

bool EvaluationPosition::operator<(const EvaluationPosition& right) const
{
	return GetScore() < right.GetScore();
}

/*Functions for pick best enemy target*/
void EvaluationPosition::EvaluateDistanceToMyTankScore(MyTank* myTank, float weight)
{
	float score = 1/(Manhattan(myTank->GetPosition(), m_vPosition) + 1);
	m_fScore += score*weight;
}

void EvaluationPosition::EvaluateDistanceToItemsScore(float weight)
{
	//still thinking...
	m_fScore += 0;
}

void EvaluationPosition::EvaluateNumberOfMyTankChosenScore(int enemyId, float weight)
{
	m_fScore += TargetMgr->GetNumChosen(enemyId)*weight;
}

void EvaluationPosition::EvaluateShootableEnemy(glm::vec2 myTankPos, float weight)
{
	float score = 0;
	if (TargetMgr->isShootableAEnemy(myTankPos, m_vPosition))
		score = 1;
	m_fScore += score * weight;
}

void EvaluationPosition::EvaluateCloseToMainBase(glm::vec2 mainBasePos, float weight)
{
	float score = 1 / (Manhattan(m_vPosition, mainBasePos) + 1);
	m_fScore += score * weight;
}

/*evaluation for attack main base enemy.*/
void EvaluationPosition::EvaluateDistanceToEnemyBaseTarget(glm::vec2 enemyBaseTargetPos, float weight)
{
	float score = 1 / (Manhattan(m_vPosition, enemyBaseTargetPos) + 1);
	m_fScore += score*weight;
}

void EvaluationPosition::EvaluateSameXAxisWithBaseTarget(glm::vec2 enemyBaseTargetPos, float weight)
{
	float score = 0;
	if (m_vPosition.x == enemyBaseTargetPos.x)
		score += 1;
	m_fScore += score*weight;
}

void EvaluationPosition::EvaluateWithCenter(glm::vec2 enemyBaseTargetPos, float weight)
{
	float score = 0;
	float yCenter = 10.5;
	float a = enemyBaseTargetPos.y - yCenter;
	float b = m_vPosition.y - yCenter;
	if (a*b > 0)
	{
		score = 1;
	}
	m_fScore += score * weight;
}


void EvaluationPosition::EvaluateWithinViewScore(glm::vec2 tankPos, float weigth)
{
	float score = 0;
	if (isPointInsideYView(m_vPosition, tankPos) || isPointInsideXView(m_vPosition, tankPos))
		score = 1;
	m_fScore += score*weigth;
}

void EvaluationPosition::EvaluateOrthogonalScore(glm::vec2 bulletDir, glm::vec2 tankPos, float weight)
{
	float score = 0;
	glm::vec2 dirTankToPos = m_vPosition - tankPos;
	if (glm::length(dirTankToPos) > 0)
	{
		dirTankToPos = glm::normalize(dirTankToPos);
		float dot = glm::dot(dirTankToPos, bulletDir);
		if (dot == 0)
			score = 1;
	}
	m_fScore += score * weight;
}

void EvaluationPosition::EvaluateBestDirToDodgeScore(glm::vec2 tankPos, glm::vec2 bestDirToDodge, float weight)
{
	float score = 0;
	glm::vec2 posDir =  m_vPosition - tankPos;
	if (glm::length(posDir) > 0)
	{
		if (glm::normalize(posDir) == bestDirToDodge)
			score = 1;
	}
	m_fScore += score * weight;
}
