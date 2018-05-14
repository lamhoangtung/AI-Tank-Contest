#pragma once

class PowerUp
{
	friend class Game;
private:
	int m_id;
	float m_x;
	float m_y;
	int m_type;	
	bool m_active;
	void Set(int id, float x, float y, bool active, int type);

public:
	PowerUp();
	PowerUp(int id, float x, float y, bool active, int type);

	int GetID();
	float GetX();
	float GetY();
	int GetType();
	bool IsActive();
};