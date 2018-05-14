#pragma once
#include "GoalComposite.h"
#include "MyTank.h"

class MyTank;

class GoalFollowPath : public GoalComposite<MyTank>
{
public:
	GoalFollowPath(MyTank* pOwner, std::list<PathEdge> p);

	void Activate() override;
	int Process() override;
	void Terminate() override;
private:
	std::list<PathEdge> m_Path;
};

