type Coord = [number, number];

interface PolygonJoint {
    distance: number;
    coord: Coord;
    next: PolygonJoint;
}

class Polygon {
    private readonly _points: Coord[] = [
        [0, 0],
        [0, 1],
        [1, 1],
        [1, 0]
    ];
    private readonly _k: number = 5;
    // ====================================================================================
    // public interfaces
    // ====================================================================================
    public output() {
        let bisections = this._genBisection(this._genGolygonStructures());
        console.log(JSON.stringify(bisections));
    }

    // ====================================================================================
    // private interfaces
    // ====================================================================================
    private _PolygonJointDir(joint: PolygonJoint) {
        let normal = (a: number, b: number) => {
            if (a == b) {
                return 0;
            }
            return (a - b) / Math.abs(a - b);
        };
        let [sx, sy] = joint.coord;
        let [ex, ey] = joint.next.coord;
        return [normal(sy, sx), normal(ey, ex)];
    }

    private _genGolygonStructures() {
        let points = [...this._points.slice(), this._points[0]];
        let mapped = points.map((each, idx, arr) => {
            let coord: Coord = each.slice() as Coord;
            let idxLast = idx == 0 ? arr.length - 1 : idx - 1;
            let pLast = arr[idxLast];
            let distance = Math.sqrt(
                Math.pow(each[0] - pLast[0], 2) + Math.pow(each[1] - pLast[1], 2)
            );
            return { distance, coord, next: null } as PolygonJoint;
        });
        mapped.forEach((each, idx, arr) => {
            let idxNext = idx == arr.length - 1 ? 0 : idx + 1;
            each.next = arr[idxNext];
        });
        return mapped;
    }

    private _genBisection(joints: PolygonJoint[]) {
        let totalDistance = joints.reduce((pre, cur) => pre + cur.distance, 0);
        let bisectionDistance = totalDistance / this._k;
        let dismap = joints.map(each => each.distance);
        joints.forEach((each, idx) => {
            each.distance = dismap.slice(0, idx + 1).reduce((pre, cur) => pre + cur, 0);
        });
        return [...Array(this._k).keys()].map(each => {
            let dis = bisectionDistance * each;
            let findJoint = joints.find(each => each.distance <= dis);
            let { distance: distanceJoin, coord: coorJoint } = findJoint;
            let deltaDistance = dis - distanceJoin;
            let [coorX, coorY] = coorJoint;
            let [dx, dy] = this._PolygonJointDir(findJoint);
            let bisectionCoord = [coorX + dx * deltaDistance, coorY + dy * deltaDistance];
            return bisectionCoord;
        });
    }
}

new Polygon().output();
