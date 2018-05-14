#pragma once
#include "MyTank.h"
#include "GoalComposite.h"

class MyTank;

class GoalMoveToPosition : public GoalComposite<MyTank>
{
public:
	GoalMoveToPosition(MyTank* pOwner, glm::vec2 d);

	void Activate() override;
	int Process() override;
	void Terminate() override;
private:
	glm::vec2 m_vDestination;
};

