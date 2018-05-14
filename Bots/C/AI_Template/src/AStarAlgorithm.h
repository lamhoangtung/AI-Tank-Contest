#pragma once
#include "Node.h"

class AStarAlgorithm
{
public:
	AStarAlgorithm();
	~AStarAlgorithm();
	static std::vector<glm::vec2> Search(glm::vec2 start, glm::vec2 goal, int currentTankId, int targetTankId);
private:
	static void IndexToPosition(int index, int &x, int &y);
};

