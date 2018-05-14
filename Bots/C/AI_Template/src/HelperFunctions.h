#pragma once
#include <glm/detail/type_vec2.hpp>
#include <cmath>

inline glm::vec2 GetRoundPosition(glm::vec2 p)
{
	return glm::vec2(round(p.x), round(p.y));
}

inline bool isTwoSquareOverLap(glm::vec2 p1, glm::vec2 p2)
{
	if (abs(p1.x - p2.x) < 1 && abs(p1.y - p2.y) < 1)
		return true;
	return false;
}

inline bool isPointInsideTank(glm::vec2 p, glm::vec2 tankPos)
{
	float margin = 0.5;
	if (tankPos.x - margin <= p.x && p.x <= tankPos.x + margin &&
		tankPos.y - margin <= p.y && p.y <= tankPos.y + margin)
		return true;
	return false;
}

inline bool isPointInsideXView(glm::vec2 p, glm::vec2 tankPos)
{
	float margin = 0.5;
	if (!isPointInsideTank(p, tankPos))
	{
		if (tankPos.y - margin <= p.y && p.y <= tankPos.y + margin)
			return true;
		return false;
	}
	return false;
}

inline bool isPointInsideYView(glm::vec2 p, glm::vec2 tankPos)
{
	float margin = 0.5;
	if (!isPointInsideTank(p, tankPos))
	{
		if (tankPos.x - margin <= p.x && p.x <= tankPos.x + margin)
			return true;
		return false;
	}
	return false;
}

inline bool isInView(glm::vec2 p, glm::vec2 tankPos)
{
	if (isPointInsideXView(p, tankPos) || isPointInsideYView(p, tankPos))
		return true;
	return false;
}

inline bool isTankInViewX(glm::vec2 tank1, glm::vec2 tank2)
{
	float tankWidth = 1;
	float distance = abs(tank1.y - tank2.y);
	return distance < tankWidth;
}

inline bool isTankInViewY(glm::vec2 tank1, glm::vec2 tank2)
{
	float tankWidth = 1;
	float distance = abs(tank1.x - tank2.x);
	return distance < tankWidth;
}

inline bool isTankInView(glm::vec2 tank1, glm::vec2 tank2)
{
	return isTankInViewX(tank1, tank2) || isTankInViewY(tank1, tank2);
}


inline bool isSpecialDividedByOneHalf(float n)
{
	return (fmodf(n, 0.5) == 0) && (n - int(n) != 0);
}

inline void PrintVector(char* prefix,glm::vec2 v)
{
	std::cout << prefix << v.x << " " << v.y << std::endl;
}

inline float GetBulletSpeedByTankType(int tankType)
{
	if (tankType == TANK_HEAVY)
		return 0.8;
	if (tankType == TANK_MEDIUM)
		return 1.0;
	if (tankType == TANK_LIGHT)
		return 1.2;
	return 0;
}