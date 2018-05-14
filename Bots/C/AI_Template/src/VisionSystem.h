#pragma once
#include "MyTank.h"
#include <map>
#include "VisionRecord.h"

class MyTank;

class VisionSystem
{
public:
	VisionSystem(MyTank* pOwner);
	~VisionSystem();

	void UpdateVision();

	bool isEnemyWithinView(int enemyId);
	bool isEnemyShootable(int enemyId);
	bool isEnemyAlive(int enemyId);
	glm::vec2 GetEnemyPosition(int enymyId);
private:
	MyTank* m_pOwner;
	std::map<int, VisionRecord> m_visionMap;
	void MakeNewEnemyRecord(int enemyId);
	bool isWithinView(glm::vec2 &p1, glm::vec2 &p2) const;
	bool isShootable(glm::vec2 p1, glm::vec2 p2) const;
};

