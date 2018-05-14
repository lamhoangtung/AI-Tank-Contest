#pragma once

#include "defines.h"

class Tank
{
	friend class Game;
	friend class AI;
private:
	int m_id;
	float m_x;
	float m_y;
	int m_team;
	int m_type;
	int m_HP;
	int m_direction;
	float m_speed;
	int m_rateOfFire;
	int m_coolDown;
	int m_damage;
	bool m_disabled;
	void Set(int id, float x, float y, int team, int type, int HP, int dir, float speed, int ROF, int cooldown, int damage, bool disabled);

public:
	Tank();
	Tank(int id, float x, float y, int team, int type, int HP, int dir, float speed, int ROF, int cooldown, int damage, bool disabled);

	int GetID();
	float GetX();
	float GetY();
	int GetTeam();
	int GetType();
	int GetHP();
	int GetDirection();
	float GetSpeed();
	int GetRateOfFire();
	int GetCoolDown();
	int GetDamage();
	bool IsDisabled();
};