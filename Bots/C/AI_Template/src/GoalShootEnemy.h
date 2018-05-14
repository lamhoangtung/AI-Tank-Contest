#pragma once
#include "MyTank.h"

class MyTank;

class GoalShootEnemy : public Goal<MyTank>
{
public:
	GoalShootEnemy(MyTank* pOwner, glm::vec2 aimPosition);
	~GoalShootEnemy();

	void Activate() override;
	int Process() override;
	void Terminate() override;
private:
	glm::vec2 m_vAimPosition;
};