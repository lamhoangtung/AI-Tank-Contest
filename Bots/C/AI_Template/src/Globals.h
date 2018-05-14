#pragma once
#include <glm/vec2.hpp>
#include <vector>
#include "ai/defines.h"

#define TANK_WIDTH 1
#define HALF_TANK_WIDTH 0.5
#define CANT_DODGE_VALUE 99

class Globals
{
public:
	static int s_TotalLoops;

	static int GetLoopCount()
	{
		return s_TotalLoops;
	}
};

const glm::vec2 dirUp = glm::vec2(0, -1);
const glm::vec2 dirDown = glm::vec2(0, 1);
const glm::vec2 dirLeft = glm::vec2(-1, 0);
const glm::vec2 dirRight = glm::vec2(1, 0);
const std::vector<glm::vec2> dirs = { dirRight,
								      dirDown,
									  dirLeft,
									  dirUp };

inline glm::vec2 GetDirByDefineDir(int defineDir)
{
	if (defineDir == DIRECTION_LEFT)
		return dirLeft;
	if (defineDir == DIRECTION_RIGHT)
		return dirRight;
	if (defineDir == DIRECTION_UP)
		return dirUp;
	if (defineDir == DIRECTION_DOWN)
		return dirDown;
	return glm::vec2();
}

inline int GetDefaultDirByVectorDir(glm::vec2 dir)
{
	if (dir == dirLeft)
		return DIRECTION_LEFT;
	if (dir == dirRight)
		return DIRECTION_RIGHT;
	if (dir == dirUp)
		return DIRECTION_UP;
	if (dir == dirDown)
		return DIRECTION_DOWN;
	return DIRECTION_NONE;
}

inline float Manhattan(glm::vec2 p1, glm::vec2 p2)
{
	return abs(p1.x - p2.x) +
		abs(p1.y - p2.y);
}

inline float EuclidianDistance(glm::vec2 p1, glm::vec2 p2)
{
	return sqrt(abs(p1.x - p2.x)*abs(p1.x - p2.x)
		+ abs(p1.y - p2.y)*abs(p1.y - p2.y));
}

const int numNodes = (MAP_W - 2)*(MAP_H - 2);
const int noParrent = -1;

const float goalDodgeBullet = 0;
const float goalHuntEnemy = 2;
const float goalAttackMainBase = 1;

#define HEAVY_BULLET_TYPE 3;

inline std::vector<int> GetAllPossibleAction()
{
	std::vector<int> actions;
	actions.push_back(DIRECTION_LEFT);
	actions.push_back(DIRECTION_DOWN);
	actions.push_back(DIRECTION_RIGHT);
	actions.push_back(DIRECTION_UP);
	actions.push_back(DIRECTION_NONE);
	return actions;
}