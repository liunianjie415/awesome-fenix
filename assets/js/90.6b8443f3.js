(window.webpackJsonp=window.webpackJsonp||[]).push([[90],{521:function(v,_,e){"use strict";e.r(_);var t=e(11),s=Object(t.a)({},(function(){var v=this,_=v.$createElement,e=v._self._c||_;return e("ContentSlotsDistributor",{attrs:{"slot-key":v.$parent.slotKey}},[e("h1",{attrs:{id:"multi-paxos与raft"}},[v._v("Multi Paxos与Raft")]),v._v(" "),e("p",[v._v("上一节的最后，笔者举例介绍了Basic Paxos的活锁问题，两个提案节点互不相让地争相提出自己的提案，抢占同一个值的修改权限，导致整个系统在持续性地“反复横跳”，外部看起来就像被锁住了一样。而在上一节的开头，笔者还陈述过一个观点，分布式共识的复杂性，主要来源于网络的不可靠与请求的可并发两大因素，活锁问题与许多Basic Paxos异常场景中所遭遇的麻烦，都可以看作是由于任何一个提案节点都能够完全平等地、与其他节点并发地提出提案而带来的复杂问题。为此，专门有一种Paxos的主要改进版本“Multi Paxos”算法被设计（设计的意思：在Lamport的论文中随意提了几句可以这么做）出来，希望能够找到一种两全其美的办法，既不破坏Paxos中“众节点平等”的原则，又能在提案节点中实现主次之分，限制每个节点都有不受控的提案权利，这两个目标听起来似乎是矛盾的，但现实世界中的选举，就很符合这种在平等节点中挑选意见领袖的场景。")]),v._v(" "),e("p",[v._v("Multi Paxos对Basic Paxos的关键改进是有了“选主”的过程，提案节点会通过定时轮询（心跳），确定当前集群中的所有节点里是否存在有一个主提案节点，一旦没有发现主节点存在，节点就会在心跳超时后使用Basic Paxos中定义的准备、批准的两轮网络交互过程，向所有其他节点广播自己希望竞选主节点的请求，希望整个集群对“由我作为主节点”这件事情协商达成一致共识，如果得到了决策节点中多数派的批准，便宣告竞选成功。当选主完成之后，除非主节点失联之后发起重新竞选，否则从此往后，就只有主节点本身才能够提出提案。此时，无论哪个提案节点接收到客户端的操作请求，都会将请求转发给主节点来完成提案，而主节点提案的时候，也就无需再次经过准备过程，因为可以视作是经过选举时的那一次准备之后，后续的提案都是对相同提案ID的一连串的批准过程。也可以通俗理解为选主过后，就不会再有其他节点与它竞争，相当于是处于无并发的环境当中进行的有序操作，所以此时集群中要对某个值达成一致，只需要进行一次批准的交互即可，具体如下序列所示：")]),v._v(" "),e("mermaid",{staticStyle:{"margin-bottom":"0px"}},[v._v("\nsequenceDiagram\n    用户->>主提案节点: 操作请求\n\t主提案节点->>决策节点: 广播Accept(n, i , value)请求\n\t决策节点--\x3e>主提案节点: 返回Accepted(n, i , value)应答\n\t主提案节点->>记录节点: 形成决议，供记录节点学习\n")]),v._v(" "),e("p",[v._v("可能有人注意到这时候的二元组(n, value)已经变成了三元组(n, i, value)，这是因为需要为主节点增加一个“任期编号”，这个编号必须是严格单调递增的，以应付主节点陷入网络分区后重新恢复，但另外一部分节点仍然有多数派，且已经完成了重新选主的情况，此时必须以任期编号大的主节点为准。当节点有了选主机制的支持，在整体来看，就可以进一步简化节点角色，不去区分提案、决策和记录节点了，统统以“节点”来代替，节点只有主（Leader）和从（Follower）的区别，此时协商共识的时序如下：")]),v._v(" "),e("mermaid",{staticStyle:{"margin-bottom":"0px"}},[v._v("\nsequenceDiagram\n    用户->>+节点（1，主）: 操作请求\n    节点（1，主）->>节点（1，主）: Accept/Accepted(n, i , value)\n\t节点（1，主）->>节点（2）: Accept(n, i , value)\n\t节点（1，主）->>节点（3）: Accept(n, i , value)\n\t节点（3）->>节点（1，主）:Accepted(n, i , value)\n\t节点（2）->>节点（1，主）:Accepted(n, i , value)\n\t节点（1，主）->>-用户: 返回结果\n")]),v._v(" "),e("p",[v._v("在这个理解的基础上，我们换一个角度来重新思考“分布式系统中如何对某个值达成一致”这个问题，可以把该问题划分做三个子问题来考虑，可以证明（具体证明就不写了，参考文末的论文）当以下三个问题同时被解决时，即等价于达成共识：")]),v._v(" "),e("ul",[e("li",[v._v("如何选主（Leader Election）")]),v._v(" "),e("li",[v._v("如何把数据复制到各个节点上（Entity Replication）")]),v._v(" "),e("li",[v._v("如何保证过程是安全的（Safety）")])]),v._v(" "),e("p",[v._v("选主问题尽管还涉及到许多工程上的细节，譬如心跳、随机超时、并行竞选，等等，但要只论原理的话，如果你已经理解了Paxos算法的介绍，相信对选主并不会有什么疑惑，因为这本质上仅仅是集群对“谁来当主节点”这件事情的达成共识而已，我们在前一节已经花了几千字来讲述集群该如何对一件事情达成共识，这里就不继续展开了，下面直接介绍数据（Paxos中的提案、Raft中的日志）在集群各节点间的复制问题。")]),v._v(" "),e("p",[v._v("在正常情况下，当客户端向主节点发起一个操作，譬如提出“将某个值设置为X”，此时主节点将X写入自己的变更日志，但先不提交，接着把变更X的信息在下一次心跳包中广播给所有的从节点，并要求从节点回复确认收到的消息，从节点收到信息后，将操作写入自己的变更日志，然后给主节点发送确认签收的消息，主节点收到过半数的签收消息后，提交自己的变更、应答客户端并且给从节点广播可以提交的消息，从节点收到提交消息后提交自己得变更，数据在节点间的复制宣告完成。")]),v._v(" "),e("p",[v._v("在异常情况下，网络出现了分区，部分节点失联，但只要仍能正常工作的节点的数量能够满足多数派，集群就仍然可以正常工作，这时候数据复制过程如下：")]),v._v(" "),e("ul",[e("li",[e("p",[v._v("假设有S"),e("sub",[v._v("1")]),v._v("、S"),e("sub",[v._v("2")]),v._v("、S"),e("sub",[v._v("3")]),v._v("、S"),e("sub",[v._v("4")]),v._v("、S"),e("sub",[v._v("5")]),v._v("五个节点，S"),e("sub",[v._v("1")]),v._v("是主节点，由于网络故障，导致S"),e("sub",[v._v("1")]),v._v("、S"),e("sub",[v._v("2")]),v._v("和S"),e("sub",[v._v("3")]),v._v("、S"),e("sub",[v._v("4")]),v._v("、S"),e("sub",[v._v("5")]),v._v("之间彼此无法通讯，形成网络分区。")])]),v._v(" "),e("li",[e("p",[v._v("一段时间后，S"),e("sub",[v._v("3")]),v._v("、S"),e("sub",[v._v("4")]),v._v("、S"),e("sub",[v._v("5")]),v._v("三个节点中的某一个（譬如是S"),e("sub",[v._v("3")]),v._v("）最先达到心跳超时的阈值，获知当前分区中已经不存在主节点了，它向所有节点发出自己要竞选的广播，并收到了S"),e("sub",[v._v("4")]),v._v("、S"),e("sub",[v._v("5")]),v._v("节点的批准响应，加上自己一共三票，即得到了多数派的批准，竞选成功，此时集群中同时存在S"),e("sub",[v._v("1")]),v._v("和S"),e("sub",[v._v("3")]),v._v("两个主节点，但由于网络分区，它们不会知道对方的存在。")])]),v._v(" "),e("li",[e("p",[v._v("这种情况下，客户端发起操作请求：")]),v._v(" "),e("ul",[e("li",[v._v("如果客户端连接到了S"),e("sub",[v._v("1")]),v._v("、S"),e("sub",[v._v("2")]),v._v("之一，都将由S"),e("sub",[v._v("1")]),v._v("处理，但由于操作只能获得最多两个节点的响应，不构成多数派的批准，所以任何变更都无法成功提交。")]),v._v(" "),e("li",[v._v("如果客户端连接到了S"),e("sub",[v._v("3")]),v._v("、S"),e("sub",[v._v("4")]),v._v("、S"),e("sub",[v._v("5")]),v._v("之一，都将由S"),e("sub",[v._v("3")]),v._v("处理，此时操作可以获得最多三个节点的响应，构成多数派的批准，是有效的，变更可以被提交，即集群可以继续提供服务。")]),v._v(" "),e("li",[v._v("事实上，以上两种“如果”情景很少机会能够并存。网络分区是由于软、硬件或者网络故障而导致的，内部网络出现了分区，但两个分区仍然能分别与外部网络的客户端正常通讯的情况甚为少见。通常集群中下线了一部分节点，按照这个例子来说，如果下线了两个节点，集群正常工作，下线了三个节点，那剩余的两个节点也不可能继续提供服务了。")])])]),v._v(" "),e("li",[e("p",[v._v("假设现在故障恢复，分区解除，五个节点重新可以通讯了：")]),v._v(" "),e("ul",[e("li",[v._v("S"),e("sub",[v._v("1")]),v._v("和S"),e("sub",[v._v("3")]),v._v("都向所有节点发送心跳包，从各自的心跳中可以得知两个主节点里S"),e("sub",[v._v("3")]),v._v("的任期编号更大，它是最新的，此时五个节点均只承认S"),e("sub",[v._v("3")]),v._v("是唯一的主节点。")]),v._v(" "),e("li",[v._v("S"),e("sub",[v._v("1")]),v._v("、S"),e("sub",[v._v("2")]),v._v("回滚它们所有未被提交的变更。")]),v._v(" "),e("li",[v._v("S"),e("sub",[v._v("1")]),v._v("、S"),e("sub",[v._v("2")]),v._v("从主节点发送的心跳包中获得它们失联期间发生的所有变更，将变更提交写入本地磁盘。")]),v._v(" "),e("li",[v._v("此时集群状态达成最终一致。")])])])]),v._v(" "),e("p",[v._v("下面我们来看第三个问题：“如何保证过程是安全的”，你是否感受到这个问题与前两点的存在一点差异？选主、数据复制都是很具体的行为，但是“安全”就很模糊，什么算是安全或者不安全？")]),v._v(" "),e("p",[v._v("在分布式理论中，"),e("code",[v._v("Safety")]),v._v("和"),e("code",[v._v("Liveness")]),v._v("两种属性是有预定义的，在专业的书籍中一般翻译成“协定性”和“终止性”，它们的概念也是由Lamport最先提出，当时给出的定义是：")]),v._v(" "),e("ul",[e("li",[v._v("协定性（Safety）：所有的坏事都不会发生（something “bad” will "),e("strong",[v._v("never")]),v._v(" happen）")]),v._v(" "),e("li",[v._v("终止性（Liveness）：所有的好事都终将发生，但不知道是啥时候（something “good” will "),e("strong",[v._v("must")]),v._v(" happen, but we don’t know when）")])]),v._v(" "),e("p",[v._v("这种就算解释了你也看不明白的定义，是不是很符合Lamport老爷子一贯的写作风格？（笔者无奈地摊摊手），我们不纠结严谨的定义，仍通过举例来说明，譬如以选主问题为例，"),e("code",[v._v("Safety")]),v._v("保证了选主的结果一定是有且只有唯一的一个主节点，不可能同时出现两个主节点；而"),e("code",[v._v("Liveness")]),v._v("则要保证选主过程是一定可以在某个时刻能够结束的。由前面对活锁的介绍可以得知，在"),e("code",[v._v("Liveness")]),v._v("这个属性上选主问题是存在理论上的瑕疵的，可能会由于活锁而导致一直无法选出明确的主节点，所以Raft论文中只写了对"),e("code",[v._v("Safety")]),v._v("的保证，但由于工程实现上的处理，现实中是几乎不可能会出现终止性的问题。")]),v._v(" "),e("p",[v._v("最后，以上这种把共识问题分解为“Leader Election”、“Entity Replication”和“Safety”三个问题来思考、解决的解题思路，即是本节主题中的“Raft算法”，这篇以“"),e("a",{attrs:{href:"https://web.stanford.edu/~ouster/cgi-bin/papers/raft-atc14",target:"_blank",rel:"noopener noreferrer"}},[v._v("一种可以让人理解的共识算法"),e("OutboundLink")],1),v._v("”（In Search of an Understandable Consensus Algorithm，Lamport：好像有人在论文标题中对我有意见？）为题的论文提出了Raft算法，获得了USENIX ATC 2014的Best Paper，后来更是成为了日后Etcd、LogCabin、Consul等重要分布式程序的实现基础，ZooKeeper的ZAB算法与Raft的思路也非常类似，这些算法都被认为是与Multi Paxos的等价派生实现。")])],1)}),[],!1,null,null,null);_.default=s.exports}}]);