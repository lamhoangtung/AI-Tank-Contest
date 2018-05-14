#include <iostream>
#include <queue>

using namespace std;
int _X[4] = {0,0,1,-1};
int _Y[4] = {1,-1,0,0};
struct ToaDo{
    int x,y,val;
    ToaDo(int x1,int y1, int v1){
        x = x1;
        y = y1;
        val = v1;
    }
};
int w,h;
bool valid(int x, int y){
    return x> 0 && x<= w && y>0 && y<= h;
}
int endx, endy;
int A[100][100];
int B[100][100];
void xuatA(){
    for(int i = 1; i<= w; ++i)
    {
        for(int j = 1; j<= h; ++j){
            printf("%4d",A[i][j]);
        }
        cout<<endl;
    }
    cout<< "======================="<<endl;
}
void BFS(){
    queue<ToaDo> Q;
    Q.push(ToaDo(endx,endy,0));
    while(!Q.empty()){
        ToaDo temp = Q.front();
        Q.pop();
        if(B[temp.y][temp.x] == 0){
            A[temp.y][temp.x] = temp.val;
            B[temp.y][temp.x] = 1;
            for(int i = 0; i< 4; ++i){
                ToaDo diem = ToaDo(temp.x + _X[i], temp.y + _Y[i],temp.val+1);
                if(valid(diem.x,diem.y) && B[diem.y][diem.x] == 0){
                    Q.push(diem);
                }
            }
        }
    }
}
int main()
{
    freopen("input.txt","r",stdin);
    cin>> w>>h;
    for(int i = 1; i<= w; i++){
        for(int j = 1; j<=h; ++j){
            cin>> B[i][j];
        }
    }
    cin>> endx>>endy;
    BFS();
    xuatA();
    return 0;
}
