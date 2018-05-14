#include "MyTeam.h"
#include <ai/PowerUp.h>
#include <ai/AI.h>
#include "Globals.h"
#include "HelperFunctions.h"

int const left_side = 7;
int const right_side = 14;
int const prepare_time = 4;

MyTeam::MyTeam()
{
	float preparingX;
	m_iClosestTankToPowerUp = -1;
	if (AI::GetInstance()->GetMyTeam() == TEAM_1)
	{
		m_fEnemySide = right_side;
		m_fMySide = left_side;
		m_iMyTeam = TEAM_1;
		m_iEnemyTeam = TEAM_2;
		preparingX = 9;
		m_vMainBasePos = glm::vec2(1.5, 10.5);
	}else
	{
		m_fEnemySide = left_side;
		m_fMySide = right_side;
		m_iMyTeam = TEAM_2;
		m_iEnemyTeam = TEAM_1;
		preparingX = 12;
		m_vMainBasePos = glm::vec2(19.5, 10.5);
	}
	for (int i=1; i<=MAP_W-2;i++)
	{
		m_vPreparingPositions.push_back(glm::vec2(preparingX, i));
	}
	m_iCurrentState = PREPARE_ATTACKING;
}

MyTeam::~MyTeam()
{
}

void MyTeam::SetTanks(std::vector<MyTank*> tanks)
{
	m_vTanks = tanks;
	
}

void MyTeam::Update()
{
	UpdateClosestTankToPowerUp();
	UpdateTarget();
	UpdateState();
	UpdateDangerousStrike();
	
//	std::cout << "Total loop: " << Globals::s_TotalLoops << std::endl;
//	PrintVector("Good preparing pos: ", GetBestPreparingPosition(glm::vec2(15, 7)));
	for (MyTank* tank : m_vTanks)
	{
		tank->Update();
	}

	UsePowerUpIfSafeForMyBase();
	Globals::s_TotalLoops++;
}

void MyTeam::UpdateClosestTankToPowerUp()
{
	std::vector<PowerUp*>  powerUp = AI::GetInstance()->GetPowerUpList();
	m_iClosestTankToPowerUp = -1;
	m_vCurrentPowerUpPos = glm::vec2();
//	std::cout << powerUp.size() << std::endl;
	if (!powerUp.empty())
	{
		int firstPowerUpActive = 0;
//		for(int i=0; i< powerUp.size(); i++)
//		{
//			if (powerUp[i]->IsActive())
//			{
//				firstPowerUpActive = i;
//				break;
//			}
//		}
		m_vCurrentPowerUpPos = glm::vec2(powerUp[firstPowerUpActive]->GetX(), powerUp[firstPowerUpActive]->GetY());
		float fastestTimeToPowerUp = 999;
		for (MyTank* tank : m_vTanks)
		{
			if (tank->GetApiTank()->GetHP() > 0)
			{
				float distance = Manhattan(m_vCurrentPowerUpPos, tank->GetPosition());
				int timeToGetPowerUp = distance / tank->GetSpeed();
				if (timeToGetPowerUp < fastestTimeToPowerUp)
				{
					fastestTimeToPowerUp = timeToGetPowerUp;
					m_iClosestTankToPowerUp = tank->ID();
				}
			}		
		}
	}
}

void MyTeam::UpdateTarget()
{
	for (MyTank* tank : m_vTanks)
	{
		if (tank->GetApiTank()->GetHP() > 0)
		{
			TargetMgr->UpdateTargetForATank(tank);
		}
	}
}

void MyTeam::UpdateState()
{
	if (Globals::s_TotalLoops <= prepare_time)
	{
		m_iCurrentState = PREPARE_ATTACKING;
	}	
	else
	{
		int numEnemyTankInsideMySide = 0;
		int dangerNumEnemyTank = 2;
		for (glm::vec2 enemyPos : TargetMgr->GetAllAliveEnemyPositions())
		{
			if (isMyTankInsideMySide(enemyPos))
			{
				numEnemyTankInsideMySide++;
			}
		}
		if (numEnemyTankInsideMySide >= dangerNumEnemyTank
			|| (numEnemyTankInsideMySide == 1 
				&& TargetMgr->GetAllAliveEnemyPositions().size() == 1))
		{
			m_iCurrentState = DEFENDING;
			return;
		}
		m_iCurrentState = ATTACKING;
	}
}

void MyTeam::SetState(unsigned state)
{
	m_iCurrentState = state;
}

unsigned MyTeam::GetCurrentState()
{
	return m_iCurrentState;
}

bool MyTeam::isMyTankInsideMySide(glm::vec2 tankPos)
{
	return isTankInsideTheirSide(tankPos.x, 
		m_iMyTeam, m_fMySide);
}

bool MyTeam::isEnemyTankInsideTheirSide(glm::vec2 tankPos)
{
	return isTankInsideTheirSide(tankPos.x,
		m_iEnemyTeam, m_fEnemySide);
}

bool MyTeam::isTankInsideTheirSide(float x, int team, float sideX)
{
	if (team == TEAM_1)
	{
		return x < sideX + 1;
	}
	else if (team == TEAM_2)
	{
		return x > sideX - 1;
	}
	return false;
}

glm::vec2 MyTeam::GetBestPreparingPosition(glm::vec2 tankPos)
{
	float closestDistance = 999;
	glm::vec2 bestPreparingPos;
	for (glm::vec2 p : m_vPreparingPositions)
	{
		float distance = Manhattan(p, tankPos);
		if (distance < closestDistance)
		{
			closestDistance = distance;
			bestPreparingPos = p;
		}
	}
	return bestPreparingPos;
}

bool MyTeam::isTheComingStrikeDangerous()
{
	return !m_vUpComingDangerStrikePos.empty();
}

std::vector<glm::vec2> MyTeam::GetDangerouseStrikePos()
{
	return m_vUpComingDangerStrikePos;
}

std::vector<glm::vec2> MyTeam::GetDangerouseStrikePosToTank(glm::vec2 tankPos)
{
	float dangerousDistance = 8;
	std::vector<glm::vec2> dangerousPos;
	for (glm::vec2 p : m_vUpComingDangerStrikePos)
	{
		if (Manhattan(tankPos, p) <= dangerousDistance)
		{
			dangerousPos.push_back(p);
		}
	}
	return dangerousPos;
}

void MyTeam::UpdateDangerousStrike()
{
	int dangerousTimeStrike = 8;
	m_vUpComingDangerStrikePos.clear();
	std::vector<Strike*> strike = AI::GetInstance()->GetIncomingStrike();
	for (int i = 0; i<strike.size(); i++)
	{
		float x = strike[i]->GetX();
		float y = strike[i]->GetY();
		int count = strike[i]->GetCountDown(); // Delay (in server loop) before the strike reach the battlefield.
		int type = strike[i]->GetType();
		
		if (count <= dangerousTimeStrike)
		{
			m_vUpComingDangerStrikePos.push_back(glm::vec2(x, y));
		}
	}
}

void MyTeam::UsePowerUpIfSafeForMyBase()
{
	glm::vec2 safePosToUsePowerUp = FindFirstSafeEnemyPosToUsePowerUp();
	if (safePosToUsePowerUp != glm::vec2())
	{
		if (AI::GetInstance()->HasAirstrike())
		{
			AI::GetInstance()->UseAirstrike(safePosToUsePowerUp.x, safePosToUsePowerUp.y);
		}
		if (AI::GetInstance()->HasEMP())
		{
			AI::GetInstance()->UseEMP(safePosToUsePowerUp.x, safePosToUsePowerUp.y);
		}
	}
}

glm::vec2 MyTeam::FindFirstSafeEnemyPosToUsePowerUp()
{
	float safeDistance = 8;
	for (glm::vec2 p : TargetMgr->GetAllAliveEnemyPositions())
	{
		float distance = EuclidianDistance(p, m_vMainBasePos);
		if (distance >= safeDistance)
			return p;
	}
	return glm::vec2();
}

MyTeam* MyTeam::GetInstance()
{
	static MyTeam instance = MyTeam();
	return &instance;
}
