#pragma once
#include <glm/vec2.hpp>
#include "MyTank.h"

class MyTank;
const int BEST_RANGE_SNIPER = 4;
const int SAFE_DISTANCE_TO_ENEMY_TO_RELOAD = 4;

class EvaluationPosition
{
public:
	EvaluationPosition(glm::vec2 p) :m_fScore(0),
									 m_vPosition(p),
									 m_iTargetEnemyId(-1)
	{}
	~EvaluationPosition();

	//evaluation functions for many perpurses.
	void EvaluateNumLineOfFireScore(float weight=1);
	void EvaluateDistanceToMyTankScore(MyTank* myTank, float weight=1);
	void EvaluateDistanceToItemsScore(float weight=1);

	//evaluation functions for pick enemy target.
	void EvaluateNumberOfMyTankChosenScore(int enemyId, float weight=1);
	void EvaluateShootableEnemy(glm::vec2 myTankPos, float weight = 1);
	void EvaluateCloseToMainBase(glm::vec2 mainBasePos, float weight=1);

	//evaluation functions for sniper to attack enemy.
	void EvaluateRangeAttackForSniperScore(glm::vec2 enemyPosition, float weight=1);

	//evaluation functions for reload.
	void EvaluateDangerouseBullets(float weight=1);
	void EvaluateCloserToEnemyToReload(glm::vec2 enemyPosition, float weight=1);
	void EvaluateOrthogonalWithMyTankScore(glm::vec2 myTankPos, float weight=1);

	//evaluation functions for attack main base.
	void EvaluateDistanceToEnemyBaseTarget(glm::vec2 enemyBaseTargetPos, float weight=1);
	void EvaluateSameXAxisWithBaseTarget(glm::vec2 enemyBaseTargetPos, float weight=1);
	void EvaluateWithCenter(glm::vec2 enemyBaseTargetPos, float weight=1);

	//evaluation functions for dodge bullet.
	void EvaluateWithinViewScore(glm::vec2 tankPos, float weigth=1);
	void EvaluateOrthogonalScore(glm::vec2 bulletDir, glm::vec2 tankPos, float weight=1);
	void EvaluateBestDirToDodgeScore(glm::vec2 tankPos, glm::vec2 bestDirToDodge, float weight=1);

	bool operator<(const EvaluationPosition & right) const;
	float GetScore()const { return  m_fScore; }
	glm::vec2 GetPosition()const { return m_vPosition; }

	void SetTargetEnemyId(int id) { m_iTargetEnemyId = id; }
	int GetTargetEnemyId() const
	{ return m_iTargetEnemyId; }
private:
	float m_fScore;
	glm::vec2 m_vPosition;

	/*This variable is a little dump ## just use for evaluation target to attack.*/
	int m_iTargetEnemyId;
};

