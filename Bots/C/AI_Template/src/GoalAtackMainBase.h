#pragma once
#include "GoalComposite.h"
#include "MyTank.h"
#include "GoalType.h"

class MyTank;

class GoalAtackMainBase : public GoalComposite <MyTank>
{
public:
	GoalAtackMainBase(MyTank* pOwner):GoalComposite(pOwner, goal_attack_main_base)
	{}
	~GoalAtackMainBase();

	void Activate() override;
	int Process() override;
	void Terminate() override;
private:
	glm::vec2 m_vAimTarget;
	glm::vec2 m_vGoodPosition;
};

