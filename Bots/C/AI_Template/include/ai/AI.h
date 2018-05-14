#pragma once

#include "defines.h"
#include "Helper.h"
#include <cstdio>
#include <iostream>
#include <vector>
#include "Obstacle.h"
#include "Tank.h"
#include "Bullet.h"
#include "ClientCommand.h"
#include "Base.h"
#include "PowerUp.h"
#include "Strike.h"

/// @class AI class.
/// @brief Main entity of the game.
class AI
{
	friend class Game;
private:
	/// Current global game state
	int m_gameState;

	/// Map described by an array of MAP_W x MAP_H unsigned integers
	unsigned int m_map[MAP_W * MAP_H];

	/// AI instance.
	static AI* s_instance;

	/// Team index of the player, either @e TEAM_1 or @e TEAM_2
	int m_team;

	/// Match result
	int m_matchResult;

	/// Set team index of the player.
	/// @param team Either @e TEAM_1 or @e TEAM_2.
	/// @return No return value.
	void SetMyTeam(int team);

	/// Soft obstacles in the map
	std::vector<Obstacle*> m_obstacles;

	/// Hard obstacles in the map
	std::vector<Obstacle*> m_hardObstacles;

	/// Tanks in the map
	std::vector<Tank*> m_tanks[2];

	/// Bullets in the map
	std::vector<Bullet*> m_bullets[2];

	/// Bases of 2 teams
	std::vector<Base*> m_bases[2];

	/// Client commands
	ClientCommand* m_clientCommands[NUMBER_OF_TANK];

	/// String to save tank placement
	std::string m_tankPlacementPacket;

	/// Number of tank placed
	int m_numberOfTankPlaced;

	/// Power up
	std::vector<PowerUp*> m_powerUps;

	/// Inventories
	std::vector<int> m_inventory[2];

	/// Strikes
	std::vector<Strike*> m_strikes[2];

	/// Time remains
	int m_timeLeft;

	/// Pending command as a string.
	std::wstring m_commandToBeSent;

public:
	static void CreateInstance()
	{
		if (s_instance == NULL)
			s_instance = new AI();
	}

	static AI* GetInstance()
	{
		return s_instance;
	}

	static void DestroyInstance()
	{
		if (s_instance)
		{
			delete s_instance;
			s_instance = NULL;
		}
	}

	AI();

	/// Function pointer for tank placement
	void(*PlaceTank)();

	/// Function pointer for AI updates
	void(*Update)();

	/// Function to get information of entire game board.
	/// @return Pointer to a 1-dimension array of MAP_SIZExMAP_SIZE integers, describing types of the blocks in the whole game board.\n
	/// Then you can access element at (x,y) by using board[CONVERT_COORD(x,y)].
	/// @see GetBlock()
	unsigned int * GetMap();

	/// Function to get type of a block at specific position.
	/// @param x the column of the block to check.
	/// @param y the row of the block to check.
	/// @return Type of the block at position [x, y] in the game board.\n
	/// Block type can be one of these:\n
	/// @e BLOCK_GROUND\n
	/// @e BLOCK_WATER\n
	/// @e BLOCK_HARD_OBSTACLE\n
	/// @e BLOCK_SOFT_OBSTACLE
	int GetBlock(int x, int y);

	/// Function to get ID of current player
	/// @return ID of your bot, can be either @e TEAM_1 or @e TEAM_2
	int GetMyTeam();

	/// Function to get ID of current player
	/// @return ID of your bot, can be either @e TEAM_1 or @e TEAM_2
	int GetOpponentTeam();

	/// Function to return all obstacles
	std::vector<Obstacle*> GetObstacles();

	/// Function to return your tank
	/// @param id Id of your tank.
	/// @return Pointer to your tank.
	Tank* GetMyTank(int id);

	/// Function to return your enemy's tank
	/// @param id Id of your enemy's tank.
	/// @return Pointer to your enemy's tank.
	Tank* GetEnemyTank(int id);

	/// Function to return your bullets
	std::vector<Bullet*> GetMyBullets();

	/// Function to return your enemy's bullets
	std::vector<Bullet*> GetEnemyBullets();

	/// Function to return your bases
	std::vector<Base*> GetMyBases();

	/// Function to return your enemy's bases
	std::vector<Base*> GetEnemyBases();

	/// Function to return available power-ups
	std::vector<PowerUp*> GetPowerUpList();

	/// Function to return incoming strikes, called both by your team and enemy team
	std::vector<Strike*> GetIncomingStrike();

	/// Check if you have Airstrike power-ups or not
	bool HasAirstrike();

	/// Check if you have EMP power-ups or not
	bool HasEMP();

	/// Function to use Airstrike power up
	void UseAirstrike(float x, float y);

	/// Function to use EMP power up
	void UseEMP(float x, float y);
};