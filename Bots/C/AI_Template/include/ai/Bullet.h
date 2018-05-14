#pragma once

#include "defines.h"

class Bullet
{
	friend class Game;
private:
	int m_id;
	float m_x;
	float m_y;
	int m_team;
	int m_type;
	int m_direction;
	float m_speed;
	int m_damage;
	bool m_live;
	void Set(int id, float x, float y, int team, int type, int dir, float speed, int damage, bool live);

public:
	Bullet();
	Bullet(int id, float x, float y, int team, int type, int dir, float speed, int damage, bool live);

	int GetID();
	float GetX();
	float GetY();
	int GetTeam();
	int GetType();
	int GetDirection();
	float GetSpeed();
	int GetDamage();
	bool IsAlive();
};