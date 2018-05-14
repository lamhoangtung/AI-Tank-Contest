#include <ai/Game.h>
#include <ai/AI.h>
#include <time.h>
#include "MyTank.h"
#include <cstdio>
#include <ctime>
#include "Node.h"
#include "AStarAlgorithm.h"
#include "Globals.h"
#include <set>
#include "HelperFunctions.h"
#include <glm/detail/func_geometric.inl>
#include "MyTeam.h"

// ==================== HOW TO RUN THIS =====================
// Call:
// "AI_Template.exe -h [host] -p [port] -k [key]"
//
// If no argument given, it'll be 127.0.0.1:3011
// key is a secret string that authenticate the bot identity
// it is not required when testing
// ===========================================================

//////////////////////////////////////////////////////////////////////////////////////
//                                                                                  //
//                                    GAME RULES                                    //
//                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////
// - The game is played on a map of 20x20 blocks where [x,y] is referred as the     //
// block at column x and row y.                                                     //
// - Each team has 1 main base, 2 side bases and 4 tanks.                           //
// - At the beginning of a game, each player will choose 4 tanks and place them     //
// on the map (not on any bases/obstacles/tanks).                                   //
// - The game is played in real-time mode. Each player will control 4 tanks in      //
// order to defend their bases and at the same time, try to destroy their enemy’s   //
// bases.                                                                           //
// -Your tank bullets or cannon shells will pass other allied tank (not friendly    //
// fire), but will damage your own bases, so watch where you firing.                //
// -A destroyed tank will allow bullet to pass through it, but still not allow      //
// other tanks to pass through.                                                     //
// - When the game starts (and after each 30 seconds) , a random power-up will be   //
// spawn at 1 of 3 bridges (if there are still space) at location:                  //
// [10.5, 1.5], [10.5, 10.5], [10.5, 19.5].                                         //
// - Power-ups are friendly-fired and have area of effect (AOE) damage. All units   //
// near the struck location will be affected. Use them wisely.                      //
// - The game is over when:                                                         //
//   + The main base of 1 team is destroyed. The other team is the winner.          //
//   + If all tanks of a team are destroyed, the other team is the winner.          //
//   + After 120 seconds, if both main bases are not destroyed, the team with more  //
//   side bases remaining is the winner.                                            //
//   + If both team have the same bases remaining, the game will change to “Sudden  //
//   Death” mode. In Sudden Death mode:                                             //
//     * 2 teams will play for extra 30 seconds.                                    //
//     * All destructible obstacles are removed.                                    //
//     * If 1 team can destroy any base, they are the winner.                       //
//     * After Sudden Death mode is over, the team has more tanks remaining is the  //
//     winner.                                                                      //
//   + The time is over. If it’s an active game (i.e. Some tanks and/or bases are   // 
//   destroyed), the result is a DRAW. If nothing is destroyed, it’s a BAD_DRAW.    //
//                                                                                  //
// Please read the detailed rule on our web site at:                                //
//   http://han-ai-contest2016.gameloft.com                                         //
//////////////////////////////////////////////////////////////////////////////////////

// This function is called automatically to set your tanks on the map
// Arrange your tanks as you wish using PlaceTank() command
// You can only place NUMBER_OF_TANK tanks in the map
// IMPORTANT: Remember to place all your tanks and the coordinates must be integers.
std::vector<MyTank*> myTanks;
bool isInit = false;

void MyInit()
{
	for (int i = 0; i<NUMBER_OF_TANK; i++)
	{
		Tank* tank = AI::GetInstance()->GetMyTank(i);
		MyTank* myTank = new MyTank(i);
		myTanks.push_back(myTank);
	}
	MyTeamMgr->SetTanks(myTanks);
}
void AI_Placement()
{
	int test = 6;
	AI *p_AI = AI::GetInstance();
	if (p_AI->GetMyTeam() == TEAM_1) {
		Game::PlaceTank(TANK_HEAVY, 5, 1);
		Game::PlaceTank(TANK_LIGHT, 7, 7);
		Game::PlaceTank(TANK_LIGHT, 7, 14);
		Game::PlaceTank(TANK_HEAVY, 5, 20);
	}
	else if (p_AI->GetMyTeam() == TEAM_2) {
		Game::PlaceTank(TANK_HEAVY, 16, 1);
		Game::PlaceTank(TANK_LIGHT, 14, 7);
		Game::PlaceTank(TANK_LIGHT, 14, 14);
		Game::PlaceTank(TANK_HEAVY, 16, 20);
	}
}

// This function is called automatically when it's your turn.
// Remember to call AI_Move() with a valid move before the time is run out.
// See <ai/Game.h> and <ai/AI.h> for supported APIs.
void AI_Update()
{
	if (!isInit)
	{
		MyInit();
		isInit = true;
	}	
	AI *p_AI = AI::GetInstance();
	/*test*/
	glm::vec2 tankPos = glm::vec2(11.5, 11.5);
	glm::vec2 bulletPos = glm::vec2(11.5, 9.5);
	glm::vec2 bulletDir = glm::vec2(0, 1);
	glm::vec2 dodgeDir = glm::vec2(0, -1);
	std::vector<int> blockTypes;
	blockTypes.push_back(BLOCK_HARD_OBSTACLE);
	blockTypes.push_back(BLOCK_SOFT_OBSTACLE);
	blockTypes.push_back(BLOCK_BASE);
//	std::cout << "Is shootable all case: " << TargetMgr->isShootableFromABulletToASquare(glm::vec2(6.8, 7.5), glm::vec2(6, 7), blockTypes) << std::endl;
//	std::cout << isPointInsideTank(glm::vec2(7.8, 1), glm::vec2(7.6, 1)) << std::endl;
//	std::cout << glm::dot(glm::vec2(1, 0), glm::vec2(-1, 0)) << std::endl;
//	std::cout << "Distance to dodge by dir: " << TargetMgr->CalculateDistanceToDodgeBulletByDir(tankPos, bulletPos, bulletDir, dodgeDir) << std::endl;
//	std::cout << "Is valid dir and time: " << TargetMgr->isPossibleToMoveByDirAndTime(tankPos, 0.2, glm::vec2(-1, 0), 3) << std::endl;
//	std::cout << "Time to tank: " << TargetMgr->GetTimeAInViewBulletToHitATank(tankPos, bulletPos, bulletDir, 1.2) << std::endl;
//	std::vector<glm::vec2> testPathAstar = AStarAlgorithm::Search(glm::vec2(10, 9), glm::vec2(9, 1), -1, -1);
//	PrintVector("Found goal: ", testPathAstar.front());
//	PrintVector("Check normalize: ", glm::normalize(glm::vec2(14 -5, 0)));
//	std::cout << int(0) << std::endl;
//	std::cout << "Is inside: " << isPointInsideTank(glm::vec2(5, 6.5), glm::vec2(5, 6)) << std::endl;
//	std::cout << "Test possible to dodge side by side: " << TargetMgr->isTheFakeClosestBulletPossibleToDodgeSideBySide(tankPos, 0.5,
//		bulletPos, bulletDir, 1.2) << std::endl;
//	glm::vec2 a = 2.0f * glm::vec2();
//	PrintVector("Check vector zero: ", a);
//	std::cout << Manhattan(glm::vec2(12, 9), glm::vec2(13, 7.5)) << std::endl;
// =========================================================================================================
	std::clock_t start = std::clock();
	MyTeamMgr->Update();
	double duration = (std::clock() - start) / (double)CLOCKS_PER_SEC;
	cout << "Update time: " << duration << " s" << endl;
	// =========================================================================================================
	// This is an example on how you use your power up if you acquire one.
	// If you have airstrike or EMP, you may use them anytime.
	// I just give a primitive example here: I strike on the first enemy tank, as soon as I acquire power up
	// =========================================================================================================
	if (p_AI->HasAirstrike())
	{
		for (int i = 0; i < NUMBER_OF_TANK; i++)
		{
			Tank* tempTank = p_AI->GetEnemyTank(i);
			if (tempTank->GetHP() > 0) {
				p_AI->UseAirstrike(tempTank->GetX(), tempTank->GetY());
			}
		}
	}
	else if (p_AI->HasEMP())
	{
		for (int i = 0; i < NUMBER_OF_TANK; i++)
		{
			Tank* tempTank = p_AI->GetEnemyTank(i);
			if (tempTank->GetHP() > 0)
			{
				p_AI->UseEMP(tempTank->GetX(), tempTank->GetY());
			}
		}
	}

	// Leave this here, don't remove it.
	// This command will send all of your tank command to server
	Game::GetInstance()->SendCommand();
//	std::cout << "Num of loops: " << Globals::s_TotalLoops << std::endl;
}

////////////////////////////////////////////////////////////
//                DON'T TOUCH THIS PART                   //
////////////////////////////////////////////////////////////

int main(int argc, char* argv[])
{
	srand(clock());
	
#ifdef _WIN32
    INT rc;
    WSADATA wsaData;

    rc = WSAStartup(MAKEWORD(2, 2), &wsaData);
    if (rc) {
        printf("WSAStartup Failed.\n");
        return 1;
    }
#endif

	Game::CreateInstance();
	Game * p_Game = Game::GetInstance();
	
	// Create connection
	if (p_Game->Connect(argc, argv) == -1)
	{
		LOG("Failed to connect to server!\n");
		return -1;
	}

	// Set up function pointers
	AI::GetInstance()->PlaceTank = &AI_Placement;
	AI::GetInstance()->Update = &AI_Update;
	
	// Polling every 100ms until the connection is dead
    p_Game->PollingFromServer();

	Game::DestroyInstance();

#ifdef _WIN32
    WSACleanup();
#endif
	return 0;
}