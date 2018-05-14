#include "VisionSystem.h"
#include "ai/AI.h"


VisionSystem::VisionSystem(MyTank* pOwner):m_pOwner(pOwner)
{
	
}


VisionSystem::~VisionSystem()
{
}

void VisionSystem::MakeNewEnemyRecord(int enemyId)
{
	if (m_visionMap.find(enemyId) == m_visionMap.end())
	{
		m_visionMap[enemyId] = VisionRecord();
	}
}


void VisionSystem::UpdateVision()
{
	for (int i=0; i < NUMBER_OF_TANK; i++)
	{
		Tank* enemyTank = AI::GetInstance()->GetEnemyTank(i);
		MakeNewEnemyRecord(i);
		VisionRecord& info = m_visionMap[i];
		info.m_vLastSeenPosition = glm::vec2(enemyTank->GetX(), enemyTank->GetY());
		info.m_bShootable = isShootable(m_pOwner->GetPosition(), info.m_vLastSeenPosition);
		info.hp = enemyTank->GetHP();
		if (info.m_bShootable)
		{
//			std::cout << "My tank " << m_pOwner->ID() << ": can shoot enemy tank " << i << std::endl;
		}
	}
}

bool VisionSystem::isEnemyWithinView(int enemyId)
{
	auto it = m_visionMap.find(enemyId);
	if (it != m_visionMap.end())
	{
		return it->second.m_bWithinView;
	}
	return false;
}

bool VisionSystem::isEnemyShootable(int enemyId)
{
	auto it = m_visionMap.find(enemyId);
	if (it != m_visionMap.end())
	{
		return it->second.m_bShootable;
	}
	return false;
}

bool VisionSystem::isEnemyAlive(int enemyId)
{
	return m_visionMap.find(enemyId)->second.hp > 0;
}

glm::vec2 VisionSystem::GetEnemyPosition(int enemyId)
{
	return m_visionMap.find(enemyId)->second.m_vLastSeenPosition;
}

bool VisionSystem::isWithinView(glm::vec2& p1, glm::vec2& p2) const
{
	return false;
}

bool VisionSystem::isShootable(glm::vec2 p1, glm::vec2 p2) const
{
//	int roundX1 = round(p1.x);
//	int roundY1 = round(p1.y);
//	int roundX2 = round(p2.x);
//	int roundY2 = round(p2.y);
//	int maxX, maxY, minX, minY;
//
//	if (roundY1 == roundY2)
//	{
//		minX = roundX1 > roundX2 ? roundX2 : roundX1;
//		maxX = roundX1 > roundX2 ? roundX1 : roundX2;
//		for (int x = minX; x <= maxX; x++)
//		{
//			if (AI::GetInstance()->GetBlock(x, roundY1) != BLOCK_GROUND
//				&& AI::GetInstance()->GetBlock(x, roundY1) != BLOCK_WATER)
//				return false;
//		}
//		return true;
//	}else if (roundX1 == roundX2)
//	{
//		minY = roundY1 > roundY2 ? roundY2 : roundY1;
//		maxY = roundY1 > roundY2 ? roundY1 : roundY2;
//		for (int y = minY; y <= maxY; y++)
//		{
//			if (AI::GetInstance()->GetBlock(roundX1, y) != BLOCK_GROUND
//				&& AI::GetInstance()->GetBlock(roundX1, y) != BLOCK_WATER)
//				return false;
//		}
//		return true;
//	}
//
//	return false;
	return m_pOwner->isShootableBase(p2);
}
