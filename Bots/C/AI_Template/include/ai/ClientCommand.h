#pragma once

class ClientCommand
{
	friend class Game;
private:
	int m_direction;
	bool m_move;
	bool m_shoot;
	bool m_dirty;

public:
	ClientCommand();
	ClientCommand(int direction, bool move, bool shoot, bool dirty);

	void SetCommand(int direction, bool move, bool shoot, bool dirty);
};