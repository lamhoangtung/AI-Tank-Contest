#pragma once

#include "defines.h"

class Obstacle
{
	friend class Game;
private:
	int m_id;
	int m_x;
	int m_y;
	int m_HP;
	bool m_destructible;
	void Set(int id, int x, int y, int HP, bool destructible);

public:
	Obstacle();
	Obstacle(int id, int x, int y, int HP, bool destructible);

	int GetID();
	int GetX();
	int GetY();
	int GetHP();
	bool IsDestructible();
};