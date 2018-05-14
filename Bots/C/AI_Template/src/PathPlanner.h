#pragma once
#include "MyTank.h"
#include <list>
#include "PathEdge.h"
#include <vector>

class MyTank;
class PathEdge;

class PathPlanner
{
private:
	typedef std::list<PathEdge> Path;
	enum { no_closest_node_found = -1};
	std::vector<glm::vec2> m_Path;
	MyTank* m_pOwner;
public:
	PathPlanner(MyTank* owner);
	~PathPlanner();

	glm::vec2 m_vDestinationPos;
	bool RequestPathToPosition(glm::vec2 target);
	Path GetPathAsEdges(glm::vec2 goal) const;
};

