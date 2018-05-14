#pragma once
#include "Goal.h"
#include "MyTank.h"

class MyTank;

class GoalTraverseEdge : public Goal<MyTank>
{
public:
	GoalTraverseEdge(MyTank* pOwner,
					PathEdge edge,
					bool lastEdge);

private:
	PathEdge m_Edge;
	bool m_bLastEdgeInPath;
	double m_dTimeExpected;
	double m_dStartTime;
	bool isStuck() const;


public:
	void Activate() override;
	int Process() override;
	void Terminate() override;
};

