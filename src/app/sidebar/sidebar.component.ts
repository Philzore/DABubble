import { FlatTreeControl } from '@angular/cdk/tree';
import { Component } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';

/**
 * Food data with nested structure.
 * Each node has a name and an optional list of children.
 */
interface ChatNode {
  name: string;
  children?: ChatNode[];
}

interface DirectMessageNode {
  firstName:string;
  lastName:string;
  img:string;
  online:boolean;
  yourself?:boolean;
  childrem?: DirectMessageNode[];
}

const TREE_DATA: ChatNode[] = [
  {
    name: 'Channels',
    children: [{ name: '#Allgemein' }, { name: '#Coding' }, { name: '#Zocken' }],
  },
  {
    name: 'Direktnachrichten',
    children: [{ name: 'Musti' }, { name: 'Hasan' }, { name: 'Phil' }],
  },
];

/** Flat node with expandable and level information */
interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
 
  private _transformer = (node: ChatNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
    };
  };

  treeControl = new FlatTreeControl<ExampleFlatNode>(
    node => node.level,
    node => node.expandable,
  );

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    node => node.level,
    node => node.expandable,
    node => node.children,
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  constructor() {
    this.dataSource.data = TREE_DATA;
  }

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;

}
