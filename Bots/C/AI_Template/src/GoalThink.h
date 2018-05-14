#pragma once
#include "GoalComposite.h"
#include "MyTank.h"
#include "GoalEvaluator.h"
#include <vector>

class MyTank;

class GoalThink : public GoalComposite<MyTank>
{
public:
	GoalThink(MyTank* pOwner);
	~GoalThink();

	void Aribitrate();
	bool notPresent(unsigned int goalType) const;

	void Activate() override;
	int Process() override;
	void Terminate() override;

	void AddGoalHuntEnemy();
	void AddGoalDodgeBullet();
	void AddGoalAttackMainBase();
	void AddGoalReload();
	void AddGoalGetPowerUp();
	void AddGoalDodgeStrike();
	void AddGoalTakeGoodPosition();
	void AddGoalDodgePosition();

private:
	std::vector<GoalEvaluator*> m_vEvaluators;
};

