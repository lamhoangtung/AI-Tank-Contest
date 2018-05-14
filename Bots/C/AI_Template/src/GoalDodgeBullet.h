#pragma once
#include "Goal.h"
#include "MyTank.h"

class MyTank;

class GoalDodgeBullet : public GoalComposite<MyTank>
{
public:
	GoalDodgeBullet(MyTank* pOwner);
	~GoalDodgeBullet();

	void Activate() override;
	int Process() override;
	void Terminate() override;
};

