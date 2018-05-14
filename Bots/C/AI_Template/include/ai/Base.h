#pragma once

class Base
{
	friend class Game;
private:
	int m_id;
	int m_x;
	int m_y;
	int m_team;
	int m_type;
	int m_HP;
	void Set(int id, int x, int y, int team, int type, int HP);

public:
	Base();
	Base(int id, int x, int y, int team, int type, int HP);

	int GetID();
	int GetX();
	int GetY();
	int GetTeam();
	int GetType();
	int GetHP();
};