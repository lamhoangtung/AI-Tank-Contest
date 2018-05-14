#include "AStarAlgorithm.h"
#include <queue>
#include <iostream>
#include <set>
#include "Globals.h"
#include "HelperFunctions.h"

AStarAlgorithm::AStarAlgorithm()
{

}


AStarAlgorithm::~AStarAlgorithm()
{
}


std::vector<glm::vec2> AStarAlgorithm::Search(glm::vec2 start, glm::vec2 goal, int currentTankId, int targetTankId)
{
	int numLimitedExpandedNodes = 50;
	int currentNumExpandedNodes = 0;

	bool closedNodes[numNodes] = { false };
	float openNodes[numNodes] = { 0 };
	std::multiset<Node> prioritySet;
	
	int cameFrom[numNodes];
	for (int i = 0; i < numNodes; i++)
		cameFrom[i] = noParrent;

	std::vector<glm::vec2> path;

	Node* node;
	node = new Node(start, BLOCK_GROUND);
	node->UpdateHscore(Manhattan(start, goal));
	prioritySet.insert(*node);	

	while(!prioritySet.empty())
	{
		auto first = prioritySet.begin();
		node = new Node(first->GetPosition(), first->Type());
		prioritySet.erase(first);
		openNodes[node->GetIndexFromPosition()] = 0;
		closedNodes[node->GetIndexFromPosition()] = true;
		currentNumExpandedNodes++;

		if (node->GetPosition() == goal || currentNumExpandedNodes >= numLimitedExpandedNodes)
		{
			int x, y;
			int index = node->GetIndexFromPosition();
			while(cameFrom[index] != noParrent)
			{
				IndexToPosition(index, x, y);
				auto it = path.begin();
				path.insert(it, glm::vec2(x, y));
				index = cameFrom[index];
			}
			auto it = path.begin();
			path.insert(it, start);
			while(!prioritySet.empty())
			{
				auto it = prioritySet.begin();
				prioritySet.erase(it);
			}
			delete node;
			return path;
		}

		for (glm::vec2 ajPos :  node->GetAdjacentNodePos(currentTankId, targetTankId, goal))
		{
			Node* child = new Node(ajPos, BLOCK_GROUND);
			child->UpdateGscore(node->GetGscore() + 1);
			child->UpdateHscore(Manhattan(ajPos, goal));
//			child->UpdatePriorityLineOfFire();
//			child->UpdatePriorityBullet();
			if (closedNodes[child->GetIndexFromPosition()] == false)
			{	
				if (openNodes[child->GetIndexFromPosition()] == 0)
				{	
					openNodes[child->GetIndexFromPosition()] = child->GetPriority();
					cameFrom[child->GetIndexFromPosition()] = node->GetIndexFromPosition();
					prioritySet.insert(*child);
				}else if(openNodes[child->GetIndexFromPosition()] > child->GetPriority())
				{
					auto it = prioritySet.begin();
					for (it; it != prioritySet.end(); ++it)
					{
						if (it->GetPosition() == child->GetPosition())
							break;
					}
					prioritySet.erase(it);
					openNodes[child->GetIndexFromPosition()] = child->GetPriority();
					cameFrom[child->GetIndexFromPosition()] = node->GetIndexFromPosition();
					prioritySet.insert(*child);
				}else
				{
					delete child;
				}
			}
		}
		delete node;
	}

	return path;
}

void AStarAlgorithm::IndexToPosition(int index, int& x, int& y)
{
	x = index % (MAP_W - 2) + 1;
	y = index / (MAP_W - 2) + 1;
}
