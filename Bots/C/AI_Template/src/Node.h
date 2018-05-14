#pragma once
#include <glm/detail/type_vec2.hpp>
#include <vector>

class Node
{
public:
	Node(glm::vec2 p, int type):m_vPosition(p),
								m_iType(type),
								m_fGscore(0),
								m_fHscore(0),
								m_fPriority(0)
	{
	}

	~Node();

	glm::vec2 GetPosition() const;
	int Type() const;
	void UpdateGscore(float s);
	void UpdateHscore(float s);
	float GetGscore() const{ return m_fGscore; }
	float GetHscore() const{ return m_fHscore; }
	std::vector<glm::vec2> GetAdjacentNodePos(int currentTankId, int targetTankId, glm::vec2 goal) const;
	float GetPriority() const;
	bool operator<(const Node& right) const;
	bool isValidAdjacentPosition(glm::vec2 position, int currentTankId, int targetTankId, glm::vec2 goal) const;
	int GetIndexFromPosition() const;
	void UpdatePriorityLineOfFire();
	void UpdatePriorityBullet();
private:
	glm::vec2 m_vPosition;
	float m_fGscore;
	float m_fHscore;
	float m_fPriority;
	int m_iType;
};
