//: Playground - noun: a place where people can play

import UIKit

var str = "Hello, playground"
var i = 12;

var add = i.description + str;

var a = 1, b = 2;
(a + b).description;
var c:String = "1";
c.isEmpty;
// ------ A ------
class ParticleModel {
    var point = ( 0.0, 0.0 )
    var velocity = 100.0
    
    func updatePoint(newPoint: (Double, Double), newVelocity: Double) {
        point = newPoint
        velocity = newVelocity
    }
    
    func update(newP: (Double, Double), _ newV1: Double) {
        updatePoint(newP, newVelocity: newV1)
    }
}

var p = ParticleModel()
for i in stride(from: 0.0, through: 12, by: 1.0) {
    p.update((i * sin(i), i), i*1000)
}

// ------ B ------
func join(s1: String, s2: String, _ joiner: String = " ") -> String {
    return s1 + joiner + s2
}

var fullName = join("Harry", "Richardson", "-")