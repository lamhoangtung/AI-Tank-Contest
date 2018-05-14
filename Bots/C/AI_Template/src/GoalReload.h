#pragma once
#include "MyTank.h"

class MyTank;

class GoalReload : public GoalComposite<MyTank>
{
public:
	GoalReload(MyTank* pOwner);
	~GoalReload();

	void Activate() override;
	int Process() override;
	void Terminate() override;
};