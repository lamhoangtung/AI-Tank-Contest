#include "Node.h"
#include <vector>
#include "ai/defines.h"
#include "ai/AI.h"
#include "Globals.h"
#include "EvaluationPosition.h"
#include "HelperFunctions.h"

Node::~Node()
{
}

glm::vec2 Node::GetPosition() const
{
	return m_vPosition;
}

int Node::Type() const
{
	return m_iType;
}

void Node::UpdateGscore(float s)
{
	m_fGscore = s;
	m_fPriority += s;
}

void Node::UpdateHscore(float s)
{
	m_fHscore = s;
	m_fPriority += s;
}

std::vector<glm::vec2> Node::GetAdjacentNodePos(int currentTankId, int targetTankId, glm::vec2 goal) const
{
	std::vector<glm::vec2> adjacentNodePos;
	
	for (glm::vec2 dir : dirs)
	{
		glm::vec2 ajacentPosition = m_vPosition + dir;
		if (isValidAdjacentPosition(ajacentPosition, currentTankId, targetTankId, goal))
		{
			adjacentNodePos.push_back(ajacentPosition);
		}
	}
	return adjacentNodePos;
}

float Node::GetPriority() const
{
	return m_fPriority;
}

bool Node::operator<(const Node& right) const
{
	return GetPriority() < right.GetPriority();
}

bool Node::isValidAdjacentPosition(glm::vec2 position, int currentTankId, int targetTankId, glm::vec2 goal) const
{
	if (position == goal)
		return true;
	
	if (position.x < 0 || position.x >= MAP_W ||
		position.y < 0 || position.y >= MAP_H)
		return false;

	int typeBlock = AI::GetInstance()->GetBlock(position.x, position.y);
	if (typeBlock != BLOCK_GROUND)
		return false;

	for (int i=0; i< NUMBER_OF_TANK; i++)
	{
		Tank* teamTank = nullptr;
		Tank* enemyTank = nullptr;
		if (i != currentTankId)
		{
			teamTank = AI::GetInstance()->GetMyTank(i);
		}

		if (i != targetTankId)
		{
			enemyTank = AI::GetInstance()->GetEnemyTank(i);
		}
			
		if (teamTank)
		{
			if (isTwoSquareOverLap(position, glm::vec2(teamTank->GetX(), teamTank->GetY())))
				return false;
		}
		if (enemyTank)
		{
			if (isTwoSquareOverLap(position, glm::vec2(enemyTank->GetX(), enemyTank->GetY())))
				return false;
		}
	}

	return true;
}

int Node::GetIndexFromPosition() const
{
	return (int(m_vPosition.y) - 1)*(MAP_W - 2) + int(m_vPosition.x - 1);
}

void Node::UpdatePriorityLineOfFire()
{
	EvaluationPosition ep(m_vPosition);
	ep.EvaluateNumLineOfFireScore(5);
	m_fPriority += ep.GetScore();
}

void Node::UpdatePriorityBullet()
{
	EvaluationPosition ep(m_vPosition);
	ep.EvaluateDangerouseBullets(5);
	m_fPriority += ep.GetScore();
}
