#pragma once
#include "ai/Tank.h"
#include "glm/vec2.hpp"
#include "SteeringBehavior.h"
#include "PathPlanner.h"
#include "GoalThink.h"
#include "VisionSystem.h"
#include "TargetingSystem.h"
#include "Regulator.h"

class Tank;
class SteeringBehavior;
class PathPlanner;
class GoalThink;
class VisionSystem;
class TargetingSystem;
class Bullet;

class MyTank
{
public:
	MyTank(int id);
	~MyTank();
	
	void Update();
	void UpdateMovement();

	Tank* GetApiTank() const;

	SteeringBehavior* GetSteering() const;
	PathPlanner* GetPathPlanner() const;
	VisionSystem* GetVisionSystem()const;
	GoalThink* GetBrain()const;
	Bullet* GetCurrentClosestDangerBullet() const { return m_pClosestDangerBullet; }
	void SetCurrentClosestDangerBullet(Bullet* p) { m_pClosestDangerBullet = p; }
	glm::vec2 GetBestDirToDodgeDangerBullet()const { return m_vBestDirToDodgeDangerousBullet; }
	void SetBestDirToDodgeDangerBullet(glm::vec2 d) { m_vBestDirToDodgeDangerousBullet = d; }

	glm::vec2 GetPosition() const;
	float GetSpeed() const;
	int GetCoolDown()const;
	bool isAtPosition(glm::vec2 p) const;
	glm::vec2 m_vTmpTarget;
	int ID()const { return m_iId; }

	void FireOn() { m_bIsShoot = true; }
	void FireOff() { m_bIsShoot = false; }
	void MoveOn() { m_bIsMove = true; }
	void MoveOff() { m_bIsMove = false; }
	void SetDirection(int d) { m_iCurrentDirection = d; }
	int GetCurrentDirection() { return m_iCurrentDirection; }

	void AimAndShootAtPosition(glm::vec2 position);
	int GetDirectionToPosition(glm::vec2 position);
	bool isEnemyInView();
	bool isShootableAEnemy(glm::vec2 enemyPosition) const;
	bool isShootableBase(glm::vec2 enemyBasePositon);
	bool isBulletDangerous(glm::vec2 bulletPosition);
	bool isSafe()const;
	int GetType()const;

	/*Target enemy functions*/
	bool isCurrentEnemyTargetPresent() const
	{ return m_iCurrentTargetEnemyId != -1; }
	void SetCurrentEnemyId(int id) { m_iCurrentTargetEnemyId = id; };
	int GetCurrentTargetEnemyId() const
	{ return m_iCurrentTargetEnemyId; }
	glm::vec2 GetCurrentTargetEnemyPos();
	
	/*Functions that check the future*/
	void StopInTheNextStepIsDangerous();
	void AvoidCanNotDodgePos();
	bool isClosestEnemyTooCloseToSniper(MyTank* myTank, Tank* enemyTank);
	std::vector<int> SimulateActionsToChooseGoodActions(MyTank* myTank, Tank* enemyTank);
	bool isThisActionIsGood(MyTank* myTank, Tank* enemyTank, int action);

	/*function for dodge position*/
	void SetTimeToHitDodgePosition(int t) { m_iTimeToHitDodgePos = t; }
	void SetBestTimeToDodgePosition(int t) { m_iBestTimeToDodgePos = t; }
	int GetTimeToHitDodgePosition() const { return m_iTimeToHitDodgePos; }
	int GetBestTImeToDodgePosition() const { return m_iBestTimeToDodgePos; }
private:
	int m_iId;
	bool m_bIsShoot;
	bool m_bIsMove;
	int m_iCurrentDirection;

	//Steering behavior.
	SteeringBehavior* m_pSteeringBehavior;

	//Path planner uses  A* to find path.
	PathPlanner* m_pPathPlanner;

	//Helps to chose wich goal depends on situation.
	GoalThink* m_pBrain;

	//How this tank sees enemies.
	VisionSystem* m_pVisionSystem;

	Regulator* m_pBrainUpdateRgulator;

	/*tmp maybe can be removed*/
	Bullet* m_pClosestDangerBullet;
	glm::vec2 m_vBestDirToDodgeDangerousBullet;

	/*current target*/
	int m_iCurrentTargetEnemyId;

	/*info about dodge position*/
	int m_iTimeToHitDodgePos;
	int m_iBestTimeToDodgePos;

	int numMove;
};

