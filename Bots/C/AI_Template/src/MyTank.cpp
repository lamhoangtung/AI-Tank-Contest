#include "MyTank.h"
#include "ai/Game.h"
#include "HelperFunctions.h"
#include "Globals.h"
#include <glm/detail/func_geometric.inl>
#include "MyTeam.h"
glm::vec2 testPos = glm::vec2(2, 14.5);
//int numMove;
MyTank::MyTank(int id):m_iId(id),
					   m_bIsShoot(false),
					   m_bIsMove(false),
					   m_iCurrentDirection(DIRECTION_NONE)
{
	m_pSteeringBehavior = new SteeringBehavior(this);
	m_pPathPlanner = new PathPlanner(this);
	m_pBrain = new GoalThink(this);
	m_pVisionSystem = new VisionSystem(this);

	m_pBrainUpdateRgulator = new Regulator(1);
	m_pClosestDangerBullet = nullptr;

	m_iCurrentTargetEnemyId = -1;
	numMove = 0;

	m_iTimeToHitDodgePos = -1;
	m_iBestTimeToDodgePos = -1;
}

MyTank::~MyTank()
{
	delete m_pSteeringBehavior;
	delete m_pPathPlanner;
	delete m_pBrain;
	delete m_pVisionSystem;

	delete m_pBrainUpdateRgulator;
}

void MyTank::Update()
{
	//update every loop.
	if(m_pBrainUpdateRgulator->isReady())
	{
		m_pBrain->Aribitrate();
	}
	m_pBrain->Process();
//	PrintVector("Target seek pos: ", m_pSteeringBehavior->m_vTarget);
	UpdateMovement();
	
//	std::cout << "Is move before final move: " << m_bIsMove << std::endl;
//	std::cout << "My before final dir to go: " << m_iCurrentDirection << std::endl;
	AvoidCanNotDodgePos();
//	PrintVector("My current pos: ", GetPosition());
	
//	std::cout << "Is move final move: " << m_bIsMove << std::endl;
//	std::cout << "My final dir to go: " << m_iCurrentDirection << std::endl;
	Game::CommandTank(m_iId, m_iCurrentDirection, m_bIsMove, m_bIsShoot);
	SetCurrentClosestDangerBullet(nullptr);
	SetBestDirToDodgeDangerBullet(glm::vec2());
	SetTimeToHitDodgePosition(-1);
	SetBestTimeToDodgePosition(-1);
}

void MyTank::UpdateMovement()
{
	int direction = m_pSteeringBehavior->Calculate();
//	std::cout << "Is move on: " << m_bIsMove << std::endl;
//	std::cout << "Is seek on: " << m_pSteeringBehavior->On(SteeringBehavior::seek) << std::endl;
//	PrintVector("My current pos: ", GetPosition());
//	PrintVector("Target seek pos: ", m_pSteeringBehavior->m_vTarget);
//	std::cout << "after seek calculation i have to turn: " << direction << std::endl;
	if (direction != DIRECTION_NONE && m_bIsMove)
	{
		SetDirection(direction);
	}
}

Tank* MyTank::GetApiTank() const
{
	return AI::GetInstance()->GetMyTank(m_iId);
}


glm::vec2 MyTank::GetPosition() const
{
	Tank* tank = GetApiTank();
	return glm::vec2(tank->GetX(), tank->GetY());
}

float MyTank::GetSpeed() const
{
	return AI::GetInstance()->GetMyTank(m_iId)->GetSpeed();
}

int MyTank::GetCoolDown() const
{
	return AI::GetInstance()->GetMyTank(m_iId)->GetCoolDown();
}

SteeringBehavior* MyTank::GetSteering() const
{
	return m_pSteeringBehavior;
}

PathPlanner* MyTank::GetPathPlanner() const
{
	return m_pPathPlanner;
}

VisionSystem* MyTank::GetVisionSystem() const
{
	return m_pVisionSystem;
}

GoalThink* MyTank::GetBrain() const
{
	return m_pBrain;
}

bool MyTank::isAtPosition(glm::vec2 p) const
{
	return GetPosition() == p;
}


void MyTank::AimAndShootAtPosition(glm::vec2 position)
{
	int aimDirection = GetDirectionToPosition(position);
	if (aimDirection != DIRECTION_NONE)
	{
		SetDirection(aimDirection);
		MoveOff();
		FireOn();
	}
}

int MyTank::GetDirectionToPosition(glm::vec2 aimPos)
{
	glm::vec2 aimDir = TargetMgr->GetDirInViewPointToPoint(aimPos, GetPosition());
	return GetDefaultDirByVectorDir(aimDir);
}

bool MyTank::isEnemyInView()
{
	return false;
}

bool MyTank::isShootableAEnemy(glm::vec2 enemyPosition) const
{
	return TargetMgr->isShootableAEnemy(GetPosition(), enemyPosition);
}

bool MyTank::isShootableBase(glm::vec2 enemyBasePositon)
{
	return TargetMgr->isShootableBase(GetPosition(), enemyBasePositon);
}

bool MyTank::isBulletDangerous(glm::vec2 bulletPosition)
{
	return false;
}

bool MyTank::isSafe() const
{
	for (glm::vec2 p : TargetMgr->GetAllAliveEnemyPositions())
	{
		if(isShootableAEnemy(p))
			return false;
	}
	
	if (TargetMgr->GetAllDangerBulletPositions(GetPosition()).size() > 0)
	{
		return false;
	}
	
	return true;
}

int MyTank::GetType() const
{
	return GetApiTank()->GetType();
}

glm::vec2 MyTank::GetCurrentTargetEnemyPos()
{
	if (isCurrentEnemyTargetPresent())
	{
		Tank* enemyTank = AI::GetInstance()->GetEnemyTank(m_iCurrentTargetEnemyId);
		return glm::vec2(enemyTank->GetX(), enemyTank->GetY());
	}
	return glm::vec2();
}

void MyTank::StopInTheNextStepIsDangerous()
{
	int nextDirToMove = GetSteering()->Calculate();
	glm::vec2 nextPosInTheFuture = GetPosition() +
		GetSpeed() * GetDirByDefineDir(nextDirToMove);
	Bullet* closestBullet = TargetMgr->GetClosestDangerBullet(nextPosInTheFuture);
	if (closestBullet)
	{
		GetSteering()->SeekOff();
		MoveOff();
	}
}

void MyTank::AvoidCanNotDodgePos()
{
	Tank* closestEnemyTank = TargetMgr->GetClosestEnemyTank(GetPosition());
	
	if (closestEnemyTank)
	{
//		PrintVector("Close enemy pos: ", glm::vec2(closestEnemyTank->GetX(), closestEnemyTank->GetY()));
		if (isClosestEnemyTooCloseToSniper(this, closestEnemyTank))
		{
//			PrintVector("My pos: ", GetPosition());
//			PrintVector("Too close enemy pos=================: ", glm::vec2(closestEnemyTank->GetX(), closestEnemyTank->GetY()));
			std::vector<int> goodActions = SimulateActionsToChooseGoodActions(this, closestEnemyTank);
//			for (int action : goodActions)
//			{
//				std::cout << action << " is a good action.\n";
//			}
			auto it = std::find(goodActions.begin(), goodActions.end(), m_iCurrentDirection);
			if (!goodActions.empty() && it == goodActions.end())
			{
				/*Mybe evaluate the best action here.*/
				SetDirection(goodActions[0]);
				if (goodActions[0] != DIRECTION_NONE)
					MoveOn();
				FireOff();
			}
		}
	}
}

bool MyTank::isClosestEnemyTooCloseToSniper(MyTank* myTank, Tank* enemyTank)
{
	float dangerDistance = 2.5;
	float dangerCooldown = 0;
	float distanceBetween = Manhattan(myTank->GetPosition(), 
		glm::vec2(enemyTank->GetX(), enemyTank->GetY()));
//	float distanceBetween = Manhattan(myTank->GetPosition(),
//		testPos);
//	std::cout << "Distance: " << distanceBetween << std::endl;
//	std::cout << "Enemy cool down: " << enemyTank->GetCoolDown() << std::endl;
	return (myTank->GetType() != TANK_HEAVY) &&
		(enemyTank->GetType() != TANK_HEAVY) &&
		distanceBetween <= dangerDistance  &&
		enemyTank->GetCoolDown() <= dangerCooldown;
}

std::vector<int> MyTank::SimulateActionsToChooseGoodActions(MyTank* myTank, Tank* enemyTank)
{
	std::vector<int> goodActions;
	for (int action : GetAllPossibleAction())
	{
		if (isThisActionIsGood(myTank, enemyTank, action))
			goodActions.push_back(action);
//		else
//			std::cout << action << " not chose!\n";
	}
	return goodActions;
}

bool MyTank::isThisActionIsGood(MyTank* myTank, Tank* enemyTank, int action)
{
	glm::vec2 myTankFuturePos = myTank->GetPosition() + 
		myTank->GetSpeed() * GetDirByDefineDir(action);
	if (TargetMgr->isValidTankPosition(myTankFuturePos))
	{
		glm::vec2 enemyPos = glm::vec2(enemyTank->GetX(), enemyTank->GetY());
//		glm::vec2 enemyPos = testPos;
		float bulletSpeed = GetBulletSpeedByTankType(enemyTank->GetType());
		for (int enemyAction : GetAllPossibleAction())
		{
			glm::vec2 enemyFuturePos = enemyPos + 
				enemyTank->GetSpeed() * GetDirByDefineDir(enemyAction);

			if (isTwoSquareOverLap(myTankFuturePos, enemyFuturePos))
				return false;

			if(TargetMgr->isValidTankPosition(enemyFuturePos) && 
			   TargetMgr->isShootableAEnemy(enemyFuturePos, myTankFuturePos))
			{
				glm::vec2 fakeBulletDir = 
					TargetMgr->GetDirInViewPointToPoint(myTankFuturePos, enemyFuturePos);
//				glm::vec2 fakeBulletPos = enemyFuturePos + bulletSpeed * fakeBulletDir;
				glm::vec2 fakeBulletPos = enemyFuturePos;
				if (!TargetMgr->isTheFakeClosestBulletPossibleToDodgeSideBySide(myTank->GetPosition(), myTankFuturePos, myTank->GetSpeed(),
					fakeBulletPos, fakeBulletDir, bulletSpeed))
				{
//					std::cout << "Counter action: " << enemyAction << std::endl;
//					PrintVector("My future pos: ", myTankFuturePos);
//					PrintVector("Counter enemy future pos: ", enemyFuturePos);
//					PrintVector("Fakek bullet enemy counter pos: ", fakeBulletPos);
					return false;
				}		
			}
		}
		return true;
	}
	return false;
}