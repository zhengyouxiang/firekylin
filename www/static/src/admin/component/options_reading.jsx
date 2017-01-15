import Base from 'base';
import React from 'react';
import { Form, ValidatedInput, Radio, RadioGroup } from 'react-bootstrap-validation';

import BreadCrumb from 'admin/component/breadcrumb';
import OptionsAction from '../action/options';
import OptionsStore from '../store/options';
import TipAction from 'common/action/tip';

module.exports = class extends Base {
  constructor(props){
    super(props);
    this.state = {
      submitting: false,
      options: SysConfig.options
    };
  }
  componentDidMount(){
    this.listenTo(OptionsStore, this.handleTrigger.bind(this));
  }
  handleTrigger(data, type){
    switch(type){
      case 'saveOptionsSuccess':
        this.setState({submitting: false});
        TipAction.success('更新成功');
        for(let key in this.optionsSavedValue){
          SysConfig.options[key] = this.optionsSavedValue[key];
        }
        break;
    }
  }
  handleValidSubmit(values){
    this.setState({submitting: true});
    this.optionsSavedValue = values;
    OptionsAction.save(values);
  }
  handleInvalidSubmit(){

  }
  render(){
    let BtnProps = {}
    if(this.state.submitting){
      BtnProps.disabled = true;
    }
    return (
      <div className="fk-content-wrap">
        <BreadCrumb {...this.props} />
        <div className="manage-container">
          <h3 style={{marginBottom: '20px'}}>阅读设置</h3>
          <Form
          model={this.state.options}
          className="clearfix options-reading"
          onValidSubmit={this.handleValidSubmit.bind(this)}
          onInvalidSubmit={this.handleInvalidSubmit.bind(this)}
          >
            <RadioGroup
                defaultValue="0"
                name="postTocManual"
                label="自动生成文章TOC目录"
                help={<span>自动生成会为文章生成TOC目录，选择非自动后你也可以在文章开头插入 <code>&lt;!--toc--&gt;</code> 来为这篇文章生成目录</span>}
            >
              <Radio value="0" label="是" />
              <Radio value="1" label="否" />
            </RadioGroup>
            <div className="form-group">
              <label>每页文章数目</label>
              <ValidatedInput
                type="text"
                name="postsListSize"
                defaultValue={10}
                className="form-control"
                help="此数目用于指定文章归档输出时每页显示的文章数目."
                validate={val => {
                  if( !val ) {
                    return '请填写列表页文章数目';
                  }

                  let p = Number(val);
                  if( Number.isNaN(p) ) {
                    return '请填入一个数字';
                  }

                  if( parseInt(val) !== p ) {
                    return '请填入一个整数';
                  }
                  
                  return true;
                }}
              />
            </div>

            <RadioGroup
                defaultValue="1"
                name="feedFullText"
                label="聚合全文输出"
                help="如果你不希望在聚合中输出文章全文,请使用仅输出摘要选项.摘要的文字取决于你在文章中使用分隔符的位置."
            >
              <Radio value="1" label="全文输出" />
              <Radio value="0" label="摘要输出" />
            </RadioGroup>
            <button type="submit" {...BtnProps} className="btn btn-primary">{this.state.submitting ? '提交中...' : '提交'}</button>
          </Form>
        </div>
      </div>
    );
  }
}
