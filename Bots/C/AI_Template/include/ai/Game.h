#pragma once

#include "easywsclient.hpp"

#include <cstdlib>
#include <iostream>
#include <map>
#include <string>
#include <sstream>

#include "defines.h"
#include "Helper.h"
#include "AI.h"

#if defined _DEBUG
#define LOG(fmt, ...)  printf(fmt, __VA_ARGS__)
#else
#define LOG(fmt, ...)
#endif

using namespace std;
using easywsclient::WebSocket;

/// @class Game class
class Game
{
private:
	/// Register AI with server.
	/// @return No return value.
	void SendKey();

	/// Callback functions to handle message from server.
	/// @param data message received from server.
	/// @return No return value.
	static void OnMessage(const std::string & data);
	static void OnMessageBinary(const std::vector<uint8_t>& data);

	static void ProcessUpdateObstacleCommand(const std::vector<uint8_t>& data, int& offset);
	static void ProcessUpdateTankCommand(const std::vector<uint8_t>& data, int& offset);
	static void ProcessUpdateBulletCommand(const std::vector<uint8_t>& data, int& offset);
	static void ProcessUpdatePowerUpCommand(const std::vector<uint8_t>& data, int& offset);
	static void ProcessUpdateBaseCommand(const std::vector<uint8_t>& data, int& offset);
	static void ProcessMatchResultCommand(const std::vector<uint8_t>& data, int& offset);
	static void ProcessUpdateInventoryCommand(const std::vector<uint8_t>& data, int& offset);
	static void ProcessUpdateStrikeCommand(const std::vector<uint8_t>& data, int& offset);

public:
	/// Game instance.
	static Game* s_instance;

	/// Server address.
	static std::string host;

	/// Port to connect to server.
	static unsigned int port;

	/// Key to authen with server.
	static unsigned int key;

	/// Websocket client instance.
	static WebSocket::pointer wsClient;

	static void CreateInstance()
	{
		if (s_instance == NULL)
			s_instance = new Game();
	}

	static Game* GetInstance()
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

	Game();
	~Game();

	/// Create a websocket connection to server.
	/// @param argc number of arguments.
	/// @param argv pointer to array of arguments. Format: -k <host> -p <port> -k <key>
	/// @return -1 if failed to connect, otherwise return 0.
	int Connect(int argc, char* argv[]);

	/// Polling from server
	/// @return No return value.
	void PollingFromServer();

	/// Function to send all pending commands.
	/// @return No return value.
	void SendCommand();

	/// Function to place a tank on the map.
	/// @return No return value.
	static void PlaceTank(int type, int x, int y);

	/// Function to instruct a tank to turn/move/shoot.
	/// @return No return value.
	static void CommandTank(int id, int turn, bool move, bool shoot);

	/// Function to test ping to server.
	/// @return Ping time (in miliseconds)
	static void Ping();
};