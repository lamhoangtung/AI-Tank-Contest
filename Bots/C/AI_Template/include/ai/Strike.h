#pragma once

#include "defines.h"

class Strike
{
	friend class Game;
private:
	int m_id;
	float m_x;
	float m_y;
	int m_team;
	int m_type;	
	int m_countDown;
	bool m_live;
	void Set(int id, float x, float y, int team, int type, int countDown, bool live);

public:
	Strike();
	Strike(int id, float x, float y, int team, int type, int countDown, bool live);

	int GetID();
	float GetX();
	float GetY();
	int GetTeam();
	int GetType();
	int GetCountDown();
	bool IsAlive();
};